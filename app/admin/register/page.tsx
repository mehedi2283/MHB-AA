"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle, UserPlus } from "lucide-react";

type Status = { loading: boolean; canRegister: boolean; hasAdmins: boolean; requiresSetupToken: boolean; error: string };

export default function RegisterAdmin() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ loading: true, canRegister: false, hasAdmins: false, requiresSetupToken: false, error: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/register").then(async response => {
      const data = await response.json();
      setStatus({ loading: false, canRegister: Boolean(data.canRegister), hasAdmins: Boolean(data.hasAdmins), requiresSetupToken: Boolean(data.requiresSetupToken), error: response.ok ? "" : data.error });
    }).catch(() => setStatus({ loading: false, canRegister: false, hasAdmins: false, requiresSetupToken: false, error: "Unable to check registration status" }));
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setMessage("");
    const form = new FormData(formElement);
    const password = String(form.get("password") || "");
    if (password !== form.get("confirmPassword")) { setMessage("The passwords do not match."); return; }
    setSubmitting(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fullName: form.get("fullName"), email: form.get("email"), password, setupToken: form.get("setupToken") }),
    });
    const data = await response.json();
    setSubmitting(false);
    if (!response.ok) { setMessage(data.error || "Registration failed"); return; }
    if (data.signedIn) { router.push("/admin"); router.refresh(); return; }
    setMessage(`Admin account created for ${data.user.email}.`);
    formElement.reset();
  }

  return <main className="admin-auth"><div className="admin-auth-frame admin-auth-frame-wide">
    <aside className="admin-auth-context"><Link href="/" className="admin-brand"><span className="admin-brand-mark">M</span><span><strong>MEHEDI</strong><small>CONTROL ROOM</small></span></Link><div><span>ACCESS CONTROL</span><h1>{status.hasAdmins ? "Invite carefully." : "Establish ownership."}</h1><p>Administrator access includes publishing rights, private inquiries and provider configuration.</p></div><small>BCRYPT / SERVER-SIDE SESSION</small></aside>
    <div className="admin-auth-form admin-register-form"><Link href={status.hasAdmins ? "/admin" : "/"} className="admin-auth-back">← {status.hasAdmins ? "Back to dashboard" : "Back to portfolio"}</Link><div className="admin-auth-icon"><UserPlus size={19} /></div><div className="admin-kicker">Account provisioning</div><h2>{status.hasAdmins ? "Add administrator" : "Register owner"}</h2><p>Credentials are hashed before they are stored in Supabase.</p>
      {status.loading ? <div className="admin-loader"><LoaderCircle className="animate-spin" /></div> : status.error ? <p className="admin-notice" role="alert">{status.error}</p> : !status.canRegister ? <div className="admin-auth-fields"><p className="admin-notice">{status.hasAdmins ? "Registration is closed. Sign in as an existing administrator to add another account." : "Owner registration is locked until a private setup token is configured."}</p><Link href="/admin/login" className="admin-button">Go to sign in</Link></div> : <form onSubmit={submit} className="admin-auth-fields admin-register-grid"><label className="admin-field"><span>Full name</span><input className="admin-input" type="text" name="fullName" minLength={2} maxLength={80} required autoComplete="name" /></label><label className="admin-field"><span>Email address</span><input className="admin-input" type="email" name="email" maxLength={254} required autoComplete="email" /></label><label className="admin-field"><span>Password</span><input className="admin-input" type="password" name="password" minLength={12} maxLength={128} required autoComplete="new-password" /><small>Minimum 12 characters.</small></label><label className="admin-field"><span>Confirm password</span><input className="admin-input" type="password" name="confirmPassword" minLength={12} maxLength={128} required autoComplete="new-password" /></label>{status.requiresSetupToken && <label className="admin-field admin-field-wide"><span>Private setup token</span><input className="admin-input" type="password" name="setupToken" minLength={32} maxLength={256} required autoComplete="off" /><small>The one-time server token from deployment.</small></label>}{message && <p className={`admin-form-error admin-field-wide ${message.startsWith("Admin account") ? "is-success" : ""}`} role="status">{message.startsWith("Admin account") && <CheckCircle2 size={15} />}{message}</p>}<button className="admin-button admin-button-primary admin-auth-submit admin-field-wide" disabled={submitting}>{submitting ? <LoaderCircle className="animate-spin" size={16} /> : <UserPlus size={16} />} {status.hasAdmins ? "Create administrator" : "Create owner account"}</button></form>}
    </div>
  </div>
  </main>;
}

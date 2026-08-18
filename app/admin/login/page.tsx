"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, LoaderCircle } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
    });
    setLoading(false);
    if (!response.ok) {
      setError(response.status === 429
        ? "Too many sign-in attempts. Please wait 15 minutes and try again."
        : "The email or password is incorrect.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return <main className="admin-auth"><div className="admin-auth-frame">
    <aside className="admin-auth-context"><Link href="/" className="admin-brand"><span className="admin-brand-mark">M</span><span><strong>MEHEDI</strong><small>CONTROL ROOM</small></span></Link><div><span>PRIVATE WORKSPACE</span><h1>One place to shape the work.</h1><p>Manage the portfolio, incoming briefs and the systems behind them.</p></div><small>SUPABASE / ENCRYPTED SESSION</small></aside>
    <form onSubmit={submit} className="admin-auth-form">
      <Link href="/" className="admin-auth-back">← Back to portfolio</Link>
      <div className="admin-auth-icon"><LockKeyhole size={19} /></div>
      <div className="admin-kicker">Authorized access</div><h2>Sign in</h2><p>Use the administrator account connected to this portfolio.</p>
      <div className="admin-auth-fields"><label className="admin-field"><span>Email address</span><input className="admin-input" type="email" name="email" required autoComplete="username" /></label><label className="admin-field"><span>Password</span><input className="admin-input" type="password" name="password" minLength={8} required autoComplete="current-password" /></label>{error && <p className="admin-form-error" role="alert">{error}</p>}<button className="admin-button admin-button-primary admin-auth-submit" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={16} /> : <LockKeyhole size={16} />}Enter control room</button><p className="admin-auth-note">First time here? <Link href="/admin/register">Register the owner</Link></p></div>
    </form>
  </div>
  </main>;
}

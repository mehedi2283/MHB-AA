import { SignJWT,jwtVerify } from "jose";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export const ADMIN_SESSION_COOKIE="mehedi_admin_session";
const issuer="mehedi-portfolio";
const audience="mehedi-admin";
const secret=()=>process.env.AUTH_SECRET||"";
const key=()=>new TextEncoder().encode(secret());

export class UnauthorizedError extends Error { constructor(){super("UNAUTHORIZED");this.name="UnauthorizedError"} }
export function isUnauthorizedError(error:unknown){return error instanceof UnauthorizedError||(error instanceof Error&&error.message==="UNAUTHORIZED")}

export function sessionCookieOptions(){return {httpOnly:true,secure:(process.env.NEXT_PUBLIC_SITE_URL||"").startsWith("https://"),sameSite:"strict" as const,path:"/",maxAge:28800}}
export async function createSession(adminId:string){if(secret().length<32)throw new Error("AUTH_SECRET must contain at least 32 characters");return new SignJWT({role:"admin"}).setSubject(adminId).setProtectedHeader({alg:"HS256"}).setIssuer(issuer).setAudience(audience).setJti(crypto.randomUUID()).setIssuedAt().setExpirationTime("8h").sign(key())}
export async function verifySession(token?:string){if(!token||secret().length<32)return null;try{const {payload}=await jwtVerify(token,key(),{algorithms:["HS256"],issuer,audience});return payload.role==="admin"&&payload.sub?payload:null}catch{return null}}
export async function requireAdmin(){const jar=await cookies(),session=await verifySession(jar.get(ADMIN_SESSION_COOKIE)?.value);if(!session?.sub)throw new UnauthorizedError();const result=await supabaseAdmin().from("admins").select("email,role").eq("email",session.sub).maybeSingle();if(result.error)throw result.error;if(!result.data||!['owner','admin'].includes(result.data.role))throw new UnauthorizedError();return {sub:result.data.email,role:result.data.role}}

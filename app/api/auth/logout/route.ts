import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";
export async function POST(){const r=NextResponse.json({ok:true});r.cookies.set(ADMIN_SESSION_COOKIE,"",{httpOnly:true,maxAge:0,path:"/"});r.cookies.set("nf_session","",{httpOnly:true,maxAge:0,path:"/"});return r}

import { NextRequest,NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { logActivity } from "@/lib/supabase-data";
import { ADMIN_SESSION_COOKIE,createSession,sessionCookieOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
const schema=z.object({email:z.email(),password:z.string().min(8).max(200)});
export async function POST(req:NextRequest){const ip=req.headers.get("x-forwarded-for")||"local";if(!rateLimit(`login:${ip}`,6,900000))return NextResponse.json({error:"Unable to sign in"},{status:429});try{const data=schema.parse(await req.json()),email=data.email.toLowerCase(),db=supabaseAdmin(),result=await db.from("admins").select("email,password_hash,role").eq("email",email).maybeSingle(),admin=result.data;if(result.error||!admin?.password_hash||!['owner','admin'].includes(admin.role)||!await bcrypt.compare(data.password,admin.password_hash))return NextResponse.json({error:"Unable to sign in"},{status:401});const token=await createSession(email);await db.from("admins").update({last_login:new Date().toISOString()}).eq("email",email);await logActivity(email,"login","admin",email);const res=NextResponse.json({ok:true});res.cookies.set(ADMIN_SESSION_COOKIE,token,sessionCookieOptions());return res}catch{return NextResponse.json({error:"Unable to sign in"},{status:401})}}

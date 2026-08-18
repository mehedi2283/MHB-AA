import { NextRequest,NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE,verifySession } from "@/lib/auth";
export async function proxy(req:NextRequest){if(!req.nextUrl.pathname.startsWith("/admin")||req.nextUrl.pathname==="/admin/login"||req.nextUrl.pathname==="/admin/register")return NextResponse.next();const session=await verifySession(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);if(!session){const url=new URL("/admin/login",req.url);url.searchParams.set("next",req.nextUrl.pathname);return NextResponse.redirect(url)}return NextResponse.next()}
export const config={matcher:["/admin/:path*"]};

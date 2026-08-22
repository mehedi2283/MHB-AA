import { NextRequest,NextResponse } from "next/server";
import { z } from "zod";
import { createDocument } from "@/lib/supabase-data";
import { rateLimit } from "@/lib/rate-limit";
import crypto from "crypto";
const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().max(200),
  company: z.string().max(150).optional(),
  projectType: z.string().min(2).max(100),
  budget: z.string().max(60),
  timeline: z.string().max(60),
  message: z.string().min(20).max(5000),
  meetingRequested: z.union([z.boolean(), z.string()]).optional(),
  meetingDate: z.string().max(50).optional(),
  meetingTime: z.string().max(100).optional(),
  meetingPlatform: z.string().max(50).optional(),
  website: z.string().max(0).optional(),
});
export async function POST(req:NextRequest){const ip=req.headers.get("x-forwarded-for")?.split(",")[0]||"local";if(!rateLimit(`contact:${ip}`,4,3600000))return NextResponse.json({error:"Too many submissions"},{status:429});try{const data=schema.parse(await req.json());if(data.website)return NextResponse.json({ok:true});const {website:_,...submission}=data;void _;await createDocument("inquiries",{...submission,submissionStatus:"new",ipHash:crypto.createHash("sha256").update(ip).digest("hex"),status:"new",visible:false});return NextResponse.json({ok:true},{status:201})}catch(e){if(e instanceof z.ZodError)return NextResponse.json({error:"Please check the submitted fields"},{status:400});return NextResponse.json({error:"Unable to save the inquiry"},{status:503})}}

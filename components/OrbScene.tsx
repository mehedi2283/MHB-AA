"use client";
import dynamic from "next/dynamic";
const AIOrb=dynamic(()=>import("./AIOrb"),{ssr:false,loading:()=> <div className="absolute inset-[18%] rounded-full bg-blue-500/20 blur-3xl"/>});
export function OrbScene(){return <AIOrb/>}

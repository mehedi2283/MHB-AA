import { AdminShell } from "@/components/AdminShell";
import type { Metadata } from "next";
export const metadata:Metadata={robots:{index:false,follow:false},title:"Admin · Mehedi / AI"};
export default function Layout({children}:{children:React.ReactNode}){return <AdminShell>{children}</AdminShell>}

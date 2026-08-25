import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Mehedi — AI & Automation Specialist", template: "%s | Mehedi" },
  description: "Mehedi’s personal portfolio: AI agents, automation workflows and scalable digital products built for modern businesses.",
  openGraph: { title: "Mehedi — AI & Automation Specialist", description: "Personal portfolio of AI systems, automation workflows and SaaS products.", type: "website" },
  robots: { index: true, follow: true }
};

import { AdminSecretTrigger } from "@/components/AdminSecretTrigger";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mehedi",
    "jobTitle": "AI & Automation Specialist",
    "description": "Independent specialist building AI agents, workflow automations and SaaS products.",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "knowsAbout": ["AI agents", "Workflow automation", "API integrations", "SaaS development"]
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${inter.className}`}
    >
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${inter.className}`}
      >
        <AdminSecretTrigger />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}

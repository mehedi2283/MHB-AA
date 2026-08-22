import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pixelGameFont = localFont({
  src: "./fonts/PixelGame.otf",
  display: "swap",
  variable: "--font-pixel-game",
});

const pixeloidSans = localFont({
  src: [
    {
      path: "./fonts/PixeloidSans.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/PixeloidSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-pixeloid-sans",
});

const pixeloidMono = localFont({
  src: "./fonts/PixeloidMono.ttf",
  display: "swap",
  variable: "--font-pixeloid-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Mehedi — AI & Automation Specialist", template: "%s | Mehedi" },
  description: "Mehedi’s personal portfolio: AI agents, automation workflows and scalable digital products built for modern businesses.",
  openGraph: { title: "Mehedi — AI & Automation Specialist", description: "Personal portfolio of AI systems, automation workflows and SaaS products.", type: "website" },
  robots: { index: true, follow: true }
};

import { AdminSecretTrigger } from "@/components/AdminSecretTrigger";
import { PixelCursor } from "@/components/PixelCursor";

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
      className={`${pixelGameFont.variable} ${pixeloidSans.variable} ${pixeloidMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className={`${pixelGameFont.variable} ${pixeloidSans.variable} ${pixeloidMono.variable} ${pixeloidSans.className}`}
      >
        <PixelCursor />
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



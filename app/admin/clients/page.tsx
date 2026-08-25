import { ClientHubManager } from "@/components/ClientHubManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients & Cold Outreach · Mehedi Control Room",
};

export default function ClientsPage() {
  return <ClientHubManager />;
}

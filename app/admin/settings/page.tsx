import { IntegrationsSettingsForm } from "@/components/IntegrationsSettingsForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Google Calendar & Gmail Integrations · Admin Control Room",
};

export default function SettingsPage() {
  return <IntegrationsSettingsForm />;
}

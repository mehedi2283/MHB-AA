import { AIConversationsViewer } from "@/components/AIConversationsViewer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Conversations · Admin Control Room",
};

export default function AIConversationsPage() {
  return <AIConversationsViewer />;
}

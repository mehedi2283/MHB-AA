"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PixelBot } from "./PixelIcons";

export function AdminSecretTrigger() {
  const router = useRouter();
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    let keyBuffer = "";
    let resetTimer: NodeJS.Timeout;

    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger if user is actively typing in a form field
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Check shortcut Ctrl+Shift+A or Ctrl+Alt+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        activateAdmin();
        return;
      }

      // Buffer character typing for "admin"
      if (e.key && e.key.length === 1) {
        keyBuffer += e.key.toLowerCase();
        if (keyBuffer.length > 8) {
          keyBuffer = keyBuffer.slice(-8);
        }

        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          keyBuffer = "";
        }, 2000);

        if (keyBuffer.endsWith("admin")) {
          activateAdmin();
        }
      }
    }

    function activateAdmin() {
      setTriggered(true);
      setTimeout(() => {
        router.push("/admin");
      }, 500);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(resetTimer);
    };
  }, [router]);

  if (!triggered) return null;

  return (
    <div className="fixed inset-0 z-[9999999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
      <div className="p-6 bg-[#0c120c] border-2 border-[#c8ff3d] rounded-xl shadow-[0_0_40px_rgba(200,255,61,0.4)] space-y-4 max-w-sm">
        <div className="size-16 rounded-lg bg-[#c8ff3d20] border border-[#c8ff3d] grid place-items-center mx-auto text-[#c8ff3d] animate-pulse">
          <PixelBot size={32} />
        </div>
        <div>
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-widest">
            AUTHENTICATION SEQUENCE
          </h2>
          <p className="font-mono text-xs text-[#c8ff3d] mt-1.5 animate-pulse">
            ACCESSING CONTROL ROOM...
          </p>
        </div>
        <div className="w-full h-1.5 bg-[#1a2619] rounded-full overflow-hidden">
          <div className="h-full bg-[#c8ff3d] animate-[pixelProgress_0.6s_ease-out_forwards]" />
        </div>
      </div>
    </div>
  );
}

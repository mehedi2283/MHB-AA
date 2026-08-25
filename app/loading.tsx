import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#070907] text-[#c8ff3d]">
      <div className="relative flex flex-col items-center gap-6 p-8 border border-[#c8ff3d33] bg-[#0d110d] rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.9)] max-w-sm w-full mx-4">
        {/* Modern Vector Spinner */}
        <div className="flex items-center gap-3">
          <Loader2 size={32} className="text-[#c8ff3d] animate-spin" />
        </div>

        {/* Loading text */}
        <div className="text-center space-y-1.5">
          <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#ffffff]">
            INITIALIZING WORKSPACE
          </p>
          <p className="text-[10px] font-medium tracking-wider text-[#a4ada0]">
            SYNCING TELEMETRY · HOLD TIGHT
          </p>
        </div>

        {/* Sleek Modern Progress Bar */}
        <div className="h-1.5 w-full bg-[#161c16] rounded-full border border-[#ffffff15] overflow-hidden">
          <div className="h-full bg-[#c8ff3d] rounded-full animate-[pixelProgress_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

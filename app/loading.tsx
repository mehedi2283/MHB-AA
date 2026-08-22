import { PixelPacman } from "@/components/PixelIcons";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#070907] text-[#c8ff3d]">
      <div className="relative flex flex-col items-center gap-6 p-8 border border-[#c8ff3d33] bg-[#0d110d] rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.9)] max-w-sm w-full mx-4">
        {/* 8-Bit Pixel Character & Dots */}
        <div className="flex items-center gap-3">
          <div className="text-[#c8ff3d]">
            <PixelPacman size={28} />
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-[#c8ff3d] animate-ping" />
            <span className="h-1.5 w-1.5 bg-[#c8ff3d] animate-ping [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 bg-[#c8ff3d] animate-ping [animation-delay:0.4s]" />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-1.5">
          <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#ffffff]">
            INITIALIZING WORKSPACE
          </p>
          <p className="text-[9px] font-bold tracking-widest text-[#a4ada0]">
            SYNCING TELEMETRY · HOLD TIGHT
          </p>
        </div>

        {/* 8-Bit Stepped Progress Bar */}
        <div className="h-2 w-full bg-[#161c16] border border-[#ffffff15] p-0.5 overflow-hidden">
          <div className="h-full bg-[#c8ff3d] animate-[pixelProgress_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

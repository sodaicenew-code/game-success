import React from 'react';
import { Clue } from '../types';
import { Search, Sparkles } from 'lucide-react';

interface SuspiciousBlemishMarkerProps {
  clue: Clue;
  index: number;
  isCollected: boolean;
  isSelected: boolean;
  isUvMode?: boolean;
  isRadarPinging?: boolean;
}

export const SuspiciousBlemishMarker: React.FC<SuspiciousBlemishMarkerProps> = ({
  clue,
  index,
  isCollected,
  isSelected,
  isRadarPinging = false,
}) => {
  const markerNum = String(index + 1).padStart(2, '0');

  // 1. UNCOLLECTED STATE:
  // Clear forensic inspection target - shows a tactile optical crosshair & magnifying cue so the scene isn't barren
  if (!isCollected) {
    return (
      <div
        className="relative group/uncollected flex items-center justify-center cursor-crosshair select-none"
        title={`จุดผิดปกติน่าตรวจสอบ: ${clue.name}`}
      >
        {/* Click Target Hitbox */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 -m-7 sm:-m-8 rounded-full flex items-center justify-center relative">
          {/* Subtle Ambient Pulse Ring */}
          <div className="absolute inset-2 rounded-full border border-amber-400/40 bg-amber-500/10 backdrop-blur-[1px] animate-pulse group-hover/uncollected:bg-amber-400/25 group-hover/uncollected:border-amber-300 transition-all duration-200" />

          {/* Forensic Crosshair Corner Ticks */}
          <div className="absolute w-5 h-5 flex items-center justify-center pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-ping opacity-75" />
            <div className="w-2 h-2 rounded-full bg-amber-300 border border-amber-600 shadow-sm" />
          </div>

          {/* Magnifying Glass Indicator Pill */}
          <div className="absolute -bottom-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/85 border border-amber-400/70 text-[9px] font-mono text-amber-300 shadow-lg group-hover/uncollected:scale-110 transition-transform">
            <Search className="w-2.5 h-2.5 text-amber-400 shrink-0" />
            <span className="font-semibold whitespace-nowrap">ตรวจสอบ</span>
          </div>

          {/* Active Sonar Radar Wave when triggered */}
          {isRadarPinging && (
            <div className="absolute -inset-2 rounded-full border-2 border-amber-400 animate-ping pointer-events-none" />
          )}
        </div>

        {/* Hover Tooltip showing specific suspicious blemish label */}
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover/uncollected:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
          <div className="bg-black/95 text-amber-300 border border-amber-500/80 px-2 py-1 rounded-lg text-[10px] font-mono shadow-2xl flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="font-bold text-white">{clue.suspiciousVisualCue || clue.blemish?.label || clue.name}</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. COLLECTED STATE:
  // Authentic CSI Yellow Evidence Marker Tent (#01, #02, #03)
  return (
    <div className="relative select-none pointer-events-auto flex flex-col items-center group/tent cursor-pointer transition-transform duration-200 hover:scale-110">
      {/* 3D CSI Yellow Evidence Tent Marker */}
      <div
        className={`relative transition-all duration-200 ${
          isSelected
            ? 'scale-110 drop-shadow-[0_8px_18px_rgba(250,204,21,0.7)]'
            : 'drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]'
        }`}
      >
        {/* Tent Card Body */}
        <div className="relative w-10 sm:w-11 h-12 bg-gradient-to-b from-[#fde047] via-[#facc15] to-[#eab308] border-2 border-[#854d0e] rounded-t-sm rounded-b-[1px] flex flex-col items-center justify-between p-1 shadow-inner overflow-hidden">
          {/* Top Tent Ridge Line */}
          <div className="w-full h-1 bg-[#ca8a04]/40 border-b border-[#a16207]/30 flex items-center justify-center">
            <span className="text-[6.5px] font-mono font-bold tracking-widest text-black/80 leading-none">
              CSI EVIDENCE
            </span>
          </div>

          {/* Large Bold Black Forensic Number */}
          <div className="my-auto text-black font-mono font-black text-base sm:text-lg leading-none tracking-tight">
            {markerNum}
          </div>

          {/* Bottom Forensic Metric Scale Line */}
          <div className="w-full pt-0.5 border-t border-black/40 flex items-center justify-between px-0.5 text-[5.5px] font-mono text-black/80 font-bold">
            <span>|</span>
            <span className="tracking-tighter">5 CM</span>
            <span>|</span>
          </div>

          {/* Realistic Plastic Gloss Glare */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
        </div>

        {/* Tent Ground Shadow */}
        <div className="w-12 h-2 -mt-0.5 mx-auto bg-black/70 rounded-full blur-[1.5px] pointer-events-none" />

        {/* Selected Ring */}
        {isSelected && (
          <div className="absolute -inset-1 rounded-sm border-2 border-cyan-400 animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Label Tooltip on Hover */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/tent:opacity-100 transition-opacity duration-200 pointer-events-none z-40 whitespace-nowrap">
        <span className="bg-black/95 text-amber-300 border border-amber-500/70 px-2 py-0.5 rounded text-[9.5px] font-mono shadow-xl flex items-center gap-1">
          <span className="font-bold">#{markerNum}</span>
          <span className="text-slate-200">{clue.name}</span>
        </span>
      </div>
    </div>
  );
};

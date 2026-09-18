import React from 'react';
import { Clue } from '../types';
import { Crosshair, AlertCircle } from 'lucide-react';

interface EvidenceVisualPropProps {
  clue: Clue;
  index: number;
  isCollected: boolean;
  isSelected: boolean;
}

export const EvidenceVisualProp: React.FC<EvidenceVisualPropProps> = ({
  clue,
  index,
  isCollected,
  isSelected,
}) => {
  const markerNum = String(index + 1).padStart(2, '0');

  return (
    <div className="relative flex flex-col items-center select-none group/prop pointer-events-auto">
      {/* 1. Precision Target Hotspot / Reticle over the exact object in the scene */}
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Target Ring */}
        <div
          className={`w-9 h-9 rounded-full transition-all duration-300 flex items-center justify-center ${
            isSelected
              ? 'ring-2 ring-amber-400 bg-amber-500/30 scale-110 shadow-[0_0_16px_rgba(251,191,36,0.9)] animate-pulse'
              : isCollected
              ? 'ring-1 ring-emerald-400/80 bg-emerald-950/40 hover:scale-110 hover:ring-2 hover:ring-emerald-300'
              : 'ring-2 ring-cyan-400/90 bg-cyan-950/40 shadow-[0_0_12px_rgba(6,182,212,0.8)] hover:scale-110 hover:ring-amber-300'
          }`}
        >
          {/* Inner Crosshair Center Dot */}
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              isSelected
                ? 'bg-amber-300 shadow-[0_0_8px_#fde047]'
                : isCollected
                ? 'bg-emerald-400'
                : 'bg-cyan-300 animate-ping'
            }`}
          />

          {/* Precision Crosshair Lines */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-full h-[1px] bg-cyan-400/40" />
            <div className="h-full w-[1px] bg-cyan-400/40 absolute" />
          </div>
        </div>

        {/* 2. Authentic CSI Yellow Evidence Tent / Marker Placed Adjacent to the Object */}
        <div
          className={`absolute -top-7 -right-7 pointer-events-none flex flex-col items-center transition-all duration-200 ${
            isSelected ? 'scale-110 -translate-y-1' : 'group-hover/prop:scale-105'
          }`}
        >
          {/* 3D Slanted CSI Evidence Marker Tent */}
          <div
            className={`px-1.5 py-0.5 rounded shadow-2xl border font-mono font-black text-[11px] flex items-center gap-1 transition-colors ${
              isSelected
                ? 'bg-gradient-to-b from-amber-300 to-amber-400 text-black border-amber-500 ring-2 ring-cyan-300'
                : isCollected
                ? 'bg-gradient-to-b from-emerald-400 to-emerald-500 text-slate-950 border-emerald-600'
                : 'bg-gradient-to-b from-yellow-300 to-yellow-400 text-slate-950 border-yellow-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]'
            }`}
          >
            <span className="leading-none tracking-tight">#{markerNum}</span>
            <span className="text-[7.5px] font-sans font-bold uppercase tracking-wider opacity-80">
              EVID
            </span>
          </div>

          {/* Indicator Pin Pointing Directly to Object Coordinates */}
          <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[5px] border-t-yellow-500 -mt-[0.5px]" />
        </div>
      </div>

      {/* 3. Sleek Floating Label Below Object on Hover */}
      {!isSelected && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/prop:opacity-100 transition-opacity duration-200 pointer-events-none z-30 whitespace-nowrap">
          <div className="bg-slate-950/90 text-cyan-200 text-[9px] font-medium font-mono px-2 py-0.5 rounded-full border border-cyan-500/60 backdrop-blur-md shadow-lg flex items-center gap-1">
            <Crosshair className="w-2.5 h-2.5 text-amber-400 animate-spin" />
            <span>{clue.short}</span>
          </div>
        </div>
      )}
    </div>
  );
};

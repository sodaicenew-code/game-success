import React from 'react';
import { Clue } from '../types';
import { Sparkles, ArrowRight, X, Microscope, CheckCircle2, Search } from 'lucide-react';

interface ClueCalloutCardProps {
  clue: Clue;
  index: number;
  isCollected: boolean;
  onOpenFullModal: (clue: Clue) => void;
  onZoomScene?: () => void;
  onClose: () => void;
}

export const ClueCalloutCard: React.FC<ClueCalloutCardProps> = ({
  clue,
  index,
  isCollected,
  onOpenFullModal,
  onZoomScene,
  onClose,
}) => {
  // Determine if callout should render above or below based on position.y
  const isUpperHalf = clue.position.y < 45;
  const isRightSide = clue.position.x > 65;
  const isLeftSide = clue.position.x < 35;

  let horizontalAlign = 'left-1/2 -translate-x-1/2';
  if (isRightSide) {
    horizontalAlign = 'right-0 translate-x-2';
  } else if (isLeftSide) {
    horizontalAlign = 'left-0 -translate-x-2';
  }

  const verticalAlign = isUpperHalf
    ? 'top-full mt-3'
    : 'bottom-full mb-3';

  return (
    <div
      className={`absolute z-40 ${horizontalAlign} ${verticalAlign} w-72 sm:w-84 pointer-events-auto animate-fadeIn`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-[#0b1329]/95 backdrop-blur-xl border-2 border-cyan-400/80 rounded-xl p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.9),0_0_20px_rgba(6,182,212,0.3)] text-left relative text-slate-100 ring-1 ring-cyan-500/50">
        {/* Pointer Arrow */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0b1329] border-cyan-400 rotate-45 ${
            isUpperHalf
              ? '-top-1.5 border-t-2 border-l-2'
              : '-bottom-1.5 border-b-2 border-r-2'
          }`}
        />

        {/* Top Header with CSI Identification */}
        <div className="flex items-start justify-between gap-2 border-b border-cyan-900/60 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black font-mono font-black text-[11px] shadow-sm">
              CSI #{String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
              {clue.name}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="ปิดคำอธิบาย"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Thumbnail Photograph of Evidence if available */}
        {clue.evidenceImage && (
          <div
            className="relative w-full h-24 rounded-lg overflow-hidden border border-cyan-500/40 mb-2 cursor-pointer group/cardimg"
            onClick={() => onOpenFullModal(clue)}
            title="คลิกเพื่อตรวจสอบละเอียด (ส่องขยายร่องรอย)"
          >
            <img
              src={clue.evidenceImage}
              alt={clue.name}
              className="w-full h-full object-cover group-hover/cardimg:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-1.5">
              <span className="text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1">
                <Search className="w-3 h-3 text-cyan-400" />
                แตะเพื่อตรวจสอบละเอียด & ส่องขยาย
              </span>
            </div>
          </div>
        )}

        {/* Suspicious Visual Cue on Object */}
        {clue.suspiciousVisualCue ? (
          <div className="mb-2 p-2 rounded-lg bg-amber-950/50 border border-amber-500/50 text-[11px]">
            <div className="flex items-center gap-1 text-amber-300 font-bold mb-0.5">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span>จุดผิดปกติที่เห็นชัดบนวัตถุ:</span>
            </div>
            <p className="text-amber-100 font-medium leading-tight">
              {clue.suspiciousVisualCue}
            </p>
          </div>
        ) : clue.blemish ? (
          <div className="mb-2 p-2 rounded-lg bg-amber-950/40 border border-amber-500/40 text-[11px]">
            <div className="flex items-center gap-1 text-amber-300 font-bold mb-0.5">
              <Search className="w-3 h-3 text-amber-400 shrink-0" />
              <span>ร่องรอย/ตำหนิที่ตรวจพบ:</span>
            </div>
            <p className="text-amber-100/90 leading-tight">
              {clue.blemish.sublabel || clue.blemish.label}
            </p>
          </div>
        ) : null}

        {/* Category Badge */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 font-mono flex items-center gap-1">
            <Microscope className="w-2.5 h-2.5 text-cyan-400" />
            {clue.forensicCategory}
          </span>
          {isCollected && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
              บันทึกแฟ้มแล้ว
            </span>
          )}
        </div>

        {/* Forensic Findings Explanation */}
        <p className="text-xs text-slate-200 leading-relaxed mb-3 line-clamp-4">
          {clue.desc}
        </p>

        {/* Action Buttons: ตรวจสอบละเอียด (ซูมดูร่องรอย) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2.5 border-t border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            ตรวจพบวัตถุพยาน
          </span>

          <div className="flex items-center gap-1.5">
            {onZoomScene && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onZoomScene();
                }}
                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-mono flex items-center gap-1 border border-cyan-500/30 transition-all cursor-pointer"
                title="ซูมกล้องในสถานที่เกิดเหตุ"
              >
                <Search className="w-3 h-3 text-cyan-400" />
                <span>ซูมในห้อง</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenFullModal(clue)}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Microscope className="w-3.5 h-3.5 text-black" />
              <span>ตรวจสอบละเอียด</span>
              <ArrowRight className="w-3 h-3 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

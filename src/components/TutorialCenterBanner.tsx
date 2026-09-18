import React, { useState } from 'react';
import { Sparkles, Compass, CheckCircle2, ChevronRight, X, AlertTriangle } from 'lucide-react';

interface TutorialCenterBannerProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGuide: () => void;
  collectedCount: number;
  totalClues: number;
}

export const TutorialCenterBanner: React.FC<TutorialCenterBannerProps> = ({
  isOpen,
  onClose,
  onStartGuide,
  collectedCount,
  totalClues,
}) => {
  const [minimized, setMinimized] = useState(false);

  if (!isOpen) return null;

  if (minimized) {
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-top-4 duration-300">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-300 transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-black animate-ping" />
          <span>🎓 โหมดฝึกสอน (CSI Tutorial)</span>
          <span className="text-[11px] bg-black/20 px-2 py-0.5 rounded-full">
            {collectedCount}/{totalClues} วัตถุพยาน
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#0e1424] border-2 border-amber-500/80 max-w-md w-full rounded-2xl p-5 sm:p-6 shadow-[0_0_40px_rgba(245,158,11,0.35)] relative text-center">
        {/* Close / Minimize button */}
        <button
          onClick={() => setMinimized(true)}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
          title="ซ่อนคำแนะนำชั่วคราว"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Center Icon with Pulse */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] mb-3 relative">
          <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500"></span>
          </span>
        </div>

        {/* Central Prominent Text */}
        <div className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-1.5">
          CSI TRAINING DIVISION
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide flex items-center justify-center gap-2">
          โหมดฝึกสอน
        </h3>
        <p className="text-amber-400 text-xs font-mono tracking-widest uppercase mt-0.5 font-bold">
          TUTORIAL MODE — สถาบันนิติเวชวิทยา
        </p>

        <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed max-w-sm mx-auto">
          ยินดีต้อนรับเจ้าหน้าที่ใหม่! ในด่านนี้ระบบจะแนะนำขั้นตอนการสำรวจที่เกิดเหตุและการเก็บวัตถุพยานแบบทีละขั้นตอน
        </p>

        {/* Quick Steps */}
        <div className="mt-4 text-left bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex items-start gap-2 text-slate-200">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold shrink-0 text-[11px] mt-0.5">
              1
            </span>
            <span>
              <strong className="text-cyan-300">หาวัตถุพยาน 3 ชิ้น:</strong> มองหาจุดไฟกระพริบสีฟ้าหรือเป้าชี้แนะในภาพที่เกิดเหตุแล้วแตะเพื่อเก็บหลักฐาน
            </span>
          </div>
          <div className="flex items-start gap-2 text-slate-200">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold shrink-0 text-[11px] mt-0.5">
              2
            </span>
            <span>
              <strong className="text-amber-300">ตรวจสภาพศพ:</strong> เปิดแฟ้มเหยื่อเพื่อดูบาดแผลและคำแนะนำชี้เป้า
            </span>
          </div>
          <div className="flex items-start gap-2 text-slate-200">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold shrink-0 text-[11px] mt-0.5">
              3
            </span>
            <span>
              <strong className="text-emerald-300">ตอบคำถามชันสูตร:</strong> วิเคราะห์หาสาเหตุการเสียชีวิตที่แท้จริงเพื่อปิดคดี
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              setMinimized(true);
              onStartGuide();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            <Compass className="w-4 h-4" />
            <span>เริ่มการฝึกสอน</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMinimized(true)}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition cursor-pointer"
          >
            สำรวจเอง
          </button>
        </div>
      </div>
    </div>
  );
};

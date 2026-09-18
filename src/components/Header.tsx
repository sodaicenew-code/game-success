import React from 'react';
import { ShieldAlert, FolderKanban, BookOpen, Upload, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentStage: number;
  totalStages: number;
  score: number;
  maxScore?: number;
  isTutorial?: boolean;
  onOpenSelector: () => void;
  onOpenTutorial?: () => void;
  onOpenStageManager?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  totalStages,
  score,
  maxScore = 120,
  isTutorial,
  onOpenSelector,
  onOpenTutorial,
  onOpenStageManager,
}) => {
  const progressPercent = Math.min(100, Math.round(((currentStage - 1 + (score % 20 > 0 ? 0.5 : 0)) / Math.max(1, totalStages)) * 100));

  return (
    <header className="sticky top-0 z-40 bg-[#0d1322]/95 backdrop-blur-md border-b border-[#23304d] px-3 sm:px-4 py-2.5 sm:py-3 shadow-xl">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
        {/* CSI Division Logo */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] sm:text-[11px] tracking-wider uppercase font-tech font-bold text-cyan-400">
                DIVISION: CSI-TH
              </span>
              {isTutorial ? (
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/40 font-bold animate-pulse">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  โหมดฝึกสอน
                </span>
              ) : (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
            <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white truncate">
              นิติเวชสืบสวนคดีฆาตกรรม
            </h1>
          </div>
        </div>

        {/* Right Badges & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 font-tech shrink-0">
          {onOpenStageManager && (
            <button
              onClick={onOpenStageManager}
              className="flex items-center gap-1 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 rounded-lg px-2 sm:px-2.5 py-1.5 transition-all text-cyan-300 hover:text-white cursor-pointer shadow-sm"
              title="อัปโหลดภาพ & จัดการเพิ่ม/แก้ไขด่าน"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold hidden md:inline">จัดการด่าน</span>
            </button>
          )}

          {onOpenTutorial && (
            <button
              onClick={onOpenTutorial}
              className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 rounded-lg px-2 sm:px-2.5 py-1.5 transition-all text-amber-300 hover:text-amber-200 cursor-pointer shadow-sm"
              title="เปิดดูคู่มือและวิธีเล่น"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold hidden sm:inline">วิธีเล่น</span>
            </button>
          )}

          <button
            onClick={onOpenSelector}
            className="flex items-center gap-1 bg-[#111726] hover:bg-[#19233a] border border-[#23304d] hover:border-cyan-500/50 rounded-lg px-2 sm:px-2.5 py-1 transition-all text-slate-300 hover:text-white cursor-pointer"
            title="ดูรายชื่อแฟ้มคดีทั้งหมด"
          >
            <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
            <div className="text-left">
              <span className="text-[9px] text-slate-400 block uppercase leading-none">แฟ้มคดี</span>
              <span className="text-xs md:text-sm font-bold text-amber-400">
                {currentStage} / {totalStages}
              </span>
            </div>
          </button>

          <div className="bg-cyan-950/50 border border-cyan-500/40 rounded-lg px-2 sm:px-3 py-1 text-center shadow-[0_0_12px_rgba(0,242,254,0.15)]">
            <span className="text-[9px] text-cyan-300 block uppercase leading-none">คะแนน</span>
            <span className="text-xs md:text-sm font-bold text-cyan-400">{score}</span>
            <span className="text-[10px] text-slate-400"> / {maxScore}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto mt-2.5">
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400 h-1.5 transition-all duration-500 ease-out"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
      </div>
    </header>
  );
};

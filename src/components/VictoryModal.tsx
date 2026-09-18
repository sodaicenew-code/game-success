import React from 'react';
import { Award, RotateCcw, CheckCircle2, Plus, FolderKanban, ArrowRight, X, Sparkles } from 'lucide-react';
import { CaseStage } from '../types';

interface VictoryModalProps {
  score: number;
  totalPossibleScore: number;
  cases: CaseStage[];
  solvedCaseIds: Set<number>;
  onRestart: () => void;
  onSelectCase: (index: number) => void;
  onOpenStageManager: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  totalPossibleScore,
  cases,
  solvedCaseIds,
  onRestart,
  onSelectCase,
  onOpenStageManager,
  onClose,
}) => {
  const allSolved = cases.length > 0 && cases.every(c => solvedCaseIds.has(c.id));
  
  let rankTitle = 'ยอดนักสืบนิติเวชระดับตำนาน (Master Chief Investigator)';
  let rankBadge = 'text-cyan-400 border-cyan-400/40 bg-cyan-950/60';

  if (score < 60) {
    rankTitle = 'เจ้าหน้าที่สืบสวนฝึกหัด (Junior Field Detective)';
    rankBadge = 'text-amber-400 border-amber-400/40 bg-amber-950/60';
  } else if (score < 100) {
    rankTitle = 'นักสืบนิติเวชชำนาญการ (Senior Forensic Examiner)';
    rankBadge = 'text-teal-400 border-teal-400/40 bg-teal-950/60';
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-[#111726] border-2 border-cyan-400/70 max-w-lg w-full rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(0,242,254,0.3)] text-center space-y-3.5 relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition z-10 cursor-pointer"
          title="ปิดหน้าต่างสรุปผล"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Big Award Icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)] shrink-0">
          <Award className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        <div className="shrink-0">
          <span className="text-[11px] sm:text-xs font-mono uppercase text-cyan-400 tracking-widest font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-300" />
            CASE INVESTIGATION REPORT
          </span>
          <h3 className="text-lg sm:text-2xl font-bold text-white mt-0.5">
            {allSolved ? '🎉 ปิดแฟ้มคดีครบทุกด่านแล้ว!' : 'สรุปผลงานชันสูตรพลิกศพ'}
          </h3>
          <div className={`inline-block px-3 py-0.5 rounded-full border text-xs font-semibold mt-1.5 ${rankBadge}`}>
            {rankTitle}
          </div>
        </div>

        {/* Score & Solved Cards */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 my-1 shrink-0">
          <div className="flex justify-around items-center">
            <div className="text-center">
              <span className="text-[10px] sm:text-[11px] text-slate-400 block mb-0.5">คะแนนรวมทั้งหมด</span>
              <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-tech">{score}</span>
              <span className="text-[11px] text-slate-500 font-tech"> / {totalPossibleScore}</span>
            </div>
            <div className="w-[1px] h-9 bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] sm:text-[11px] text-slate-400 block mb-0.5">ปิดแฟ้มคดีสำเร็จ</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-tech">
                {solvedCaseIds.size}
              </span>
              <span className="text-[11px] text-slate-500 font-tech"> / {cases.length} คดี</span>
            </div>
          </div>
        </div>

        {/* Section title for jumping to stages */}
        <div className="flex items-center justify-between text-left px-1 shrink-0">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
            เลือกกลับไปด่านที่ต้องการตรวจสอบซ้ำ:
          </span>
          <span className="text-[10px] text-slate-400">คลิกที่ด่านเพื่อเล่นทันที</span>
        </div>

        {/* Summary of Cases Solved with direct Jump-To-Stage buttons */}
        <div className="text-left space-y-1.5 overflow-y-auto pr-1 flex-1 min-h-28 max-h-48">
          {cases.map((c, index) => {
            const isSolved = solvedCaseIds.has(c.id);
            return (
              <div
                key={c.id}
                onClick={() => onSelectCase(index)}
                className="group flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/70 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/60 text-xs transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSolved ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-cyan-300 font-mono text-[11px]">{c.code}</span>
                      {c.isTutorial && (
                        <span className="text-[9px] px-1 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">ฝึกสอน</span>
                      )}
                    </div>
                    <p className="text-slate-300 line-clamp-1 text-[11px] group-hover:text-white">
                      {c.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[10px] font-mono font-semibold ${isSolved ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {isSolved ? '+20 แต้ม' : 'ยังไม่ผ่าน'}
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-slate-800 group-hover:bg-cyan-500 group-hover:text-black text-[10px] font-bold text-slate-300 flex items-center gap-0.5 transition">
                    <span>กลับไปด่านนี้</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation & Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80 shrink-0">
          {/* Add New Stage / Stage Studio Button */}
          <button
            onClick={onOpenStageManager}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-500 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm tracking-wide transition shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-200" />
            <span>เพิ่มด่านใหม่ / อัปโหลดภาพจุดเกิดเหตุ</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {/* Replay All */}
            <button
              onClick={onRestart}
              className="py-2 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>เริ่มใหม่ทั้งหมด</span>
            </button>

            {/* Close & Continue Inspecting */}
            <button
              onClick={onClose}
              className="py-2 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
              <span>สำรวจจุดเกิดเหตุต่อ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


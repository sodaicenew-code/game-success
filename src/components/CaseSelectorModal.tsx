import React from 'react';
import { X, FolderKanban, CheckCircle2, ChevronRight, Plus, Upload } from 'lucide-react';
import { CaseStage } from '../types';

interface CaseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: CaseStage[];
  currentCaseId: number;
  solvedCaseIds: Set<number>;
  onSelectCase: (index: number) => void;
  onOpenStageManager?: () => void;
}

export const CaseSelectorModal: React.FC<CaseSelectorModalProps> = ({
  isOpen,
  onClose,
  cases,
  currentCaseId,
  solvedCaseIds,
  onSelectCase,
  onOpenStageManager,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#111726] border border-[#23304d] max-w-md w-full rounded-2xl p-5 shadow-[0_0_35px_rgba(0,0,0,0.8)] relative flex flex-col max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">
              แฟ้มคดีสืบสวนทั้งหมด ({cases.length} ด่าน)
            </h4>
            <p className="text-xs text-slate-400">
              เลือกคดีเพื่อเข้าตรวจสอบจุดเกิดเหตุและเก็บพยานหลักฐาน
            </p>
          </div>
        </div>

        <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
          {cases.map((c, index) => {
            const isCurrent = c.id === currentCaseId;
            const isSolved = solvedCaseIds.has(c.id);

            return (
              <button
                key={c.id}
                onClick={() => {
                  onSelectCase(index);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-950/60 border-cyan-500/60 shadow-[0_0_12px_rgba(0,242,254,0.15)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
                      c.isTutorial
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-cyan-400 border-cyan-500/20'
                    }`}>
                      {c.code}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${
                      c.isTutorial
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                        : 'bg-red-950/50 text-red-300'
                    }`}>
                      {c.tag}
                    </span>
                    {isSolved && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 ml-auto font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ปิดคดีแล้ว
                      </span>
                    )}
                  </div>
                  <h5 className="text-xs font-bold text-white truncate">
                    {c.title}
                  </h5>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {c.brief}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Action button to open Stage Studio / Upload */}
        {onOpenStageManager && (
          <div className="pt-3 mt-3 border-t border-slate-800 shrink-0">
            <button
              onClick={() => {
                onClose();
                onOpenStageManager();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>เพิ่มด่านใหม่ / อัปโหลด / จัดการข้อมูลด่าน</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

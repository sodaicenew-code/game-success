import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, AlertCircle, ArrowRight, Zap, Sparkles, Microscope, FolderKanban, Plus, Shuffle } from 'lucide-react';
import { CaseStage, DiagnosisOption } from '../types';

interface AutopsySectionProps {
  caseData: CaseStage;
  isUnlocked?: boolean;
  collectedCount?: number;
  totalClues?: number;
  onSolved: () => void;
  onProceedNext: () => void;
  isLastCase: boolean;
  sound: {
    playCorrect: () => void;
    playWrong: () => void;
  };
  onOpenSelector?: () => void;
  onOpenStageManager?: () => void;
}

export const AutopsySection: React.FC<AutopsySectionProps> = ({
  caseData,
  collectedCount = 0,
  totalClues = 3,
  onSolved,
  onProceedNext,
  isLastCase,
  sound,
  onOpenSelector,
  onOpenStageManager,
}) => {
  const [selectedOption, setSelectedOption] = useState<DiagnosisOption | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isCaseCompleted, setIsCaseCompleted] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<DiagnosisOption[]>([]);

  // Fisher-Yates algorithm to randomize/shuffle choices
  const shuffleOptionsList = (optionsList: DiagnosisOption[]): DiagnosisOption[] => {
    const arr = [...optionsList];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Reset and auto-shuffle options whenever case changes
  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(null);
    setIsCaseCompleted(false);

    if (caseData && caseData.options && caseData.options.length > 0) {
      setShuffledOptions(shuffleOptionsList(caseData.options));
    } else {
      setShuffledOptions([]);
    }
  }, [caseData.id, caseData.question]);

  // Allow player to manually re-shuffle choices
  const handleManualShuffle = () => {
    if (isCaseCompleted) return;
    if (caseData && caseData.options && caseData.options.length > 0) {
      setShuffledOptions(shuffleOptionsList(caseData.options));
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };

  const handleSelectOption = (option: DiagnosisOption) => {
    if (isCaseCompleted) return;

    setSelectedOption(option);
    if (option.correct) {
      setIsCorrect(true);
      setIsCaseCompleted(true);
      sound.playCorrect();
      onSolved();
    } else {
      setIsCorrect(false);
      sound.playWrong();
    }
  };

  const hasFullClues = collectedCount >= totalClues;
  const displayOptions = shuffledOptions.length > 0 ? shuffledOptions : (caseData.options || []);

  return (
    <section
      id="diagnosis-section"
      className="rounded-2xl p-4 sm:p-5 transition-all duration-300 bg-[#0d1424] border-2 border-cyan-500/70 shadow-[0_0_25px_rgba(0,242,254,0.15)]"
    >
      <div className="space-y-4">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-amber-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-widest font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  วินิจฉัยข้อสันนิษฐานได้ทันที (INSTANT DEDUCTION)
                </span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-white">
                วิเคราะห์สาเหตุการเสียชีวิตของผู้ตาย
              </h3>
            </div>
          </div>

          {/* Quick Clue Status Badge */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-300 border border-slate-700/80 flex items-center gap-1">
              <Microscope className="w-3 h-3 text-cyan-400" />
              <span>สำรวจพยานหลักฐาน: </span>
              <strong className={hasFullClues ? 'text-emerald-400' : 'text-amber-400'}>
                {collectedCount}/{totalClues}
              </strong>
            </span>
          </div>
        </div>

        {/* Prompt / Fast Choice Guidance */}
        <div className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800/90 leading-relaxed space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-amber-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>คำถามชันสูตรพลิกศพ:</span>
            </div>
            {!isCaseCompleted && displayOptions.length > 1 && (
              <button
                type="button"
                onClick={handleManualShuffle}
                className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-[11px] font-mono border border-cyan-500/30 flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                title="สุ่มคละลำดับช้อยส์ใหม่"
              >
                <Shuffle className="w-3 h-3 animate-spin-reverse" />
                <span>สุ่มสลับช้อยส์ (Shuffle)</span>
              </button>
            )}
          </div>
          <p className="text-slate-100 font-medium">
            {caseData.question}
          </p>
          <p className="text-[11px] text-slate-400 font-mono pt-1">
            ⚡ แตะเลือกช้อยส์ตอบได้ทันทีตั้งแต่แรกหากมั่นใจจากการวิเคราะห์ภาพ หรือจะสำรวจวัตถุพยานในห้องให้แน่ใจก่อนก็ได้! (ช้อยส์จะถูกสุ่มคละลำดับทุกครั้ง)
          </p>
        </div>

        {/* Multiple Choice Options (Randomized / Shuffled) */}
        <div className="space-y-2">
          {displayOptions.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = selectedOption === opt;
            let btnStyle = 'bg-slate-900/80 border-slate-700/80 hover:border-cyan-400 hover:bg-slate-850 text-slate-200';

            if (isSelected) {
              if (opt.correct) {
                btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
              } else {
                btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200';
              }
            } else if (isCaseCompleted && opt.correct) {
              btnStyle = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200';
            } else if (caseData.isTutorial && opt.correct && !isSelected) {
              btnStyle = 'bg-purple-950/40 border-amber-400/80 text-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:border-amber-300';
            }

            return (
              <button
                key={idx}
                disabled={isCaseCompleted}
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left p-3 rounded-xl border text-xs md:text-sm transition-all flex items-start gap-3 group cursor-pointer ${btnStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded-full border text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    isSelected && opt.correct
                      ? 'border-emerald-400 bg-emerald-900 text-emerald-200'
                      : isSelected && !opt.correct
                      ? 'border-rose-500 bg-rose-900 text-rose-200'
                      : caseData.isTutorial && opt.correct
                      ? 'border-amber-400 bg-amber-950 text-amber-300'
                      : 'border-slate-600 bg-slate-800 text-slate-400 group-hover:border-cyan-400 group-hover:text-cyan-400'
                  }`}
                >
                  {letter}
                </span>
                <div className="flex-1 pt-0.5">
                  <span className="leading-snug block font-medium">{opt.text}</span>
                  {caseData.isTutorial && opt.correct && !isCaseCompleted && (
                    <span className="inline-block mt-1 text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/50 animate-pulse">
                      💡 [ไกด์ด่านฝึกหัด] แตะเลือกข้อนี้เพื่อวินิจฉัยสาเหตุการตาย
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Banner */}
        {selectedOption && (
          <div
            className={`rounded-xl p-3.5 text-xs leading-relaxed space-y-2 transition-all ${
              isCorrect
                ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/50 border border-rose-800/60 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300">
                    {collectedCount < totalClues
                      ? '🎯 สายตาเฉียบคมมาก! วินิจฉัยภาพที่เกิดเหตุและสรุปสาเหตุการเสียชีวิตได้ถูกต้องทันที (+20 คะแนน)'
                      : 'วินิจฉัยถูกต้องตามหลักนิติเวช! (+20 คะแนน)'}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="text-rose-300">ข้อสันนิษฐานยังไม่สอดคล้องกับพยานหลักฐาน</span>
                </>
              )}
            </div>

            <p className="text-slate-300">{selectedOption.reason}</p>

            {isCorrect && (
              <div className="pt-2.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {onOpenSelector && (
                    <button
                      type="button"
                      onClick={onOpenSelector}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                      title="เลือกดูหรือย้ายไปยังด่านอื่น"
                    >
                      <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
                      <span>เลือกด่านอื่น</span>
                    </button>
                  )}
                  {onOpenStageManager && (
                    <button
                      type="button"
                      onClick={onOpenStageManager}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 hover:text-white font-semibold text-xs border border-cyan-500/40 flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                      title="เพิ่มด่านใหม่ หรืออัปโหลดรูปภาพ"
                    >
                      <Plus className="w-3.5 h-3.5 text-cyan-400" />
                      <span>เพิ่มด่านใหม่</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={onProceedNext}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <span>{isLastCase ? 'สรุปรายงานคดีทั้งหมด' : 'ไปต่อที่คดีถัดไป'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

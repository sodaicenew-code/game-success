import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ChevronDown, ChevronUp, Stethoscope, Search, User, ShieldCheck } from 'lucide-react';
import { CaseStage } from '../types';

export type TutorialStep =
  | 'INTRO'
  | 'CLUE_1'
  | 'CLUE_2'
  | 'CLUE_3'
  | 'VICTIM'
  | 'DIAGNOSIS'
  | 'COMPLETED';

interface TutorialGuideHUDProps {
  caseData: CaseStage;
  collectedClues: Set<string>;
  isCaseSolved: boolean;
  onProceedNext: () => void;
  onOpenVictimFile: () => void;
  onScrollToAutopsy: () => void;
}

export const TutorialGuideHUD: React.FC<TutorialGuideHUDProps> = ({
  caseData,
  collectedClues,
  isCaseSolved,
  onProceedNext,
  onOpenVictimFile,
  onScrollToAutopsy,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasStartedSearch, setHasStartedSearch] = useState(false);
  const [hasViewedVictim, setHasViewedVictim] = useState(false);

  // Compute current step based on state
  const hasClue1 = collectedClues.has('t-cup');
  const hasClue2 = collectedClues.has('t-lips');
  const hasClue3 = collectedClues.has('t-sachet');
  const allCluesCollected = hasClue1 && hasClue2 && hasClue3;

  let currentStep: TutorialStep = 'INTRO';

  if (isCaseSolved) {
    currentStep = 'COMPLETED';
  } else if (!hasStartedSearch && !hasClue1 && !hasClue2 && !hasClue3) {
    currentStep = 'INTRO';
  } else if (!hasClue1) {
    currentStep = 'CLUE_1';
  } else if (!hasClue2) {
    currentStep = 'CLUE_2';
  } else if (!hasClue3) {
    currentStep = 'CLUE_3';
  } else if (!hasViewedVictim) {
    currentStep = 'VICTIM';
  } else {
    currentStep = 'DIAGNOSIS';
  }

  // Get active tutorial target for CrimeSceneViewer
  // Target position and instruction label
  let targetInfo: { x: number; y: number; label: string } | null = null;
  if (currentStep === 'CLUE_1') {
    targetInfo = { x: 44, y: 64, label: '👇 แตะตรงนี้: แก้วน้ำมีคราบขาว' };
  } else if (currentStep === 'CLUE_2') {
    targetInfo = { x: 57, y: 53, label: '👇 แตะตรงนี้: ริมฝีปากเขียวคล้ำ' };
  } else if (currentStep === 'CLUE_3') {
    targetInfo = { x: 35, y: 82, label: '👇 แตะตรงนี้: ซองฟอยล์ตกใต้โต๊ะ' };
  }

  return (
    <div className="relative rounded-2xl border-2 border-amber-500/80 bg-gradient-to-r from-[#171407] via-[#1c190a] to-[#121008] p-3.5 sm:p-4 shadow-[0_0_30px_rgba(251,191,36,0.18)] select-none">
      {/* Glow highlight */}
      <div className="absolute top-0 right-1/4 w-32 h-16 bg-amber-500/20 blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-500/30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/80 flex items-center justify-center text-amber-400 shadow-sm">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block leading-none">
              TUTORIAL MODE // ระบบสอนเล่นบอกทีละจุด
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">
              ด่านพิเศษ: บททดสอบเจ้าหน้าที่ฝึกหัด CSI
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress step badge */}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-500/40">
            {currentStep === 'INTRO' && 'เริ่มต้น'}
            {currentStep === 'CLUE_1' && 'จุดที่ 1/3'}
            {currentStep === 'CLUE_2' && 'จุดที่ 2/3'}
            {currentStep === 'CLUE_3' && 'จุดที่ 3/3'}
            {currentStep === 'VICTIM' && 'ตรวจสภาพศพ'}
            {currentStep === 'DIAGNOSIS' && 'สรุปชันสูตร'}
            {currentStep === 'COMPLETED' && 'สำเร็จ 100%'}
          </span>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded bg-black/40 text-slate-400 hover:text-white border border-slate-700 transition"
            title={isMinimized ? 'ขยายคำแนะนำ' : 'ย่อคำแนะนำ'}
          >
            {isMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Body Content */}
      {!isMinimized && (
        <div className="pt-3 space-y-3">
          {/* Step 0: INTRO */}
          {currentStep === 'INTRO' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/40 p-3 rounded-xl border border-amber-500/30">
              <div className="text-xs text-slate-200 leading-relaxed">
                <span className="text-amber-300 font-bold block mb-1">
                  👮‍♂️ ครูฝึกนิติเวช: ยินดีต้อนรับสู่ด่านแรก (ด่านฝึกหัดพิเศษ)!
                </span>
                ในด่านนี้ เราจะสอนวิธีเล่นแบบจับมือทำทีละจุดจนจบด่าน: ตั้งแต่วิธีคลิกเก็บวัตถุพยานในภาพ ตรวจสภาพศพ จนถึงการเลือกสาเหตุการเสียชีวิต
              </div>
              <button
                onClick={() => setHasStartedSearch(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 transition shadow-[0_0_15px_rgba(251,191,36,0.4)] flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>เริ่มค้นหาจุดที่ 1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Step 1: CLUE 1 (Glass) */}
          {currentStep === 'CLUE_1' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/40 p-3 rounded-xl border border-amber-500/40">
              <div className="text-xs text-slate-200 leading-relaxed">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1">
                  <Search className="w-3.5 h-3.5" />
                  <span>👉 คำแนะนำจุดที่ 1 (แก้วน้ำ):</span>
                </div>
                มองดูที่โต๊ะทำงานด้านล่าง แตะที่ <strong className="text-amber-400 underline">"แก้วน้ำมีคราบขาว"</strong> ข้างมือหุ่นฝึก (สังเกตเห็นป้ายชี้เป้ากระพริบสีเหลืองบนภาพ)
              </div>
              <div className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-[11px] font-mono border border-amber-400/50 shrink-0 animate-pulse">
                คลิกที่แก้วน้ำในภาพ 👇
              </div>
            </div>
          )}

          {/* Step 2: CLUE 2 (Lips) */}
          {currentStep === 'CLUE_2' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/40 p-3 rounded-xl border border-amber-500/40">
              <div className="text-xs text-slate-200 leading-relaxed">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ดีมาก! ปักป้าย CSI #01 แล้ว 👉 คำแนะนำจุดที่ 2:</span>
                </div>
                ต่อไปให้ตรวจที่ <strong className="text-amber-400 underline">"ใบหน้าและริมฝีปากของหุ่นฝึก"</strong> (แตะตรงจุดชี้เป้าเพื่อตรวจภาวะเขียวคล้ำ Cyanosis)
              </div>
              <div className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-[11px] font-mono border border-amber-400/50 shrink-0 animate-pulse">
                คลิกที่ริมฝีปากผู้ตาย 👇
              </div>
            </div>
          )}

          {/* Step 3: CLUE 3 (Sachet) */}
          {currentStep === 'CLUE_3' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/40 p-3 rounded-xl border border-amber-500/40">
              <div className="text-xs text-slate-200 leading-relaxed">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ยอดเยี่ยม! ปักป้าย CSI #02 แล้ว 👉 คำแนะนำจุดที่ 3:</span>
                </div>
                ก้มมองที่ <strong className="text-amber-400 underline">"พื้นใต้โต๊ะทำงาน"</strong> แตะที่ <strong className="text-amber-400 underline">"ซองฟอยล์สารพิษ"</strong> ที่ตกอยู่บนพื้น
              </div>
              <div className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-[11px] font-mono border border-amber-400/50 shrink-0 animate-pulse">
                คลิกที่ซองฟอยล์ใต้โต๊ะ 👇
              </div>
            </div>
          )}

          {/* Step 4: VICTIM FILE */}
          {currentStep === 'VICTIM' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/50">
              <div className="text-xs text-slate-200 leading-relaxed">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-1">
                  <User className="w-3.5 h-3.5" />
                  <span>🎉 พยานหลักฐานครบ 3 ชิ้นแล้ว! 👉 ขั้นตอนต่อไป:</span>
                </div>
                คลิกปุ่ม <strong className="text-cyan-400">"ตรวจข้อมูลศพ/เสื้อผ้า"</strong> เพื่อตรวจสอบร่องรอยภายนอกและบันทึกอาการชีวภาพ
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    onOpenVictimFile();
                    setHasViewedVictim(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>เปิดตรวจข้อมูลศพ</span>
                </button>
                <button
                  onClick={() => setHasViewedVictim(true)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white bg-slate-800 transition cursor-pointer"
                >
                  ข้ามไปตอบคำถาม
                </button>
              </div>
            </div>
          )}

          {/* Step 5: DIAGNOSIS */}
          {currentStep === 'DIAGNOSIS' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-purple-950/40 p-3 rounded-xl border border-purple-500/50">
              <div className="text-xs text-slate-200 leading-relaxed">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold mb-1">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>📋 ขั้นตอนสุดท้าย: วิเคราะห์สาเหตุการเสียชีวิต</span>
                </div>
                เลื่อนลงไปที่กล่องชันสูตรด้านล่าง แล้วเลือกตอบ <strong className="text-purple-300 underline">"ภาวะขาดออกซิเจนในระดับเซลล์เฉียบพลันจากพิษไซยาไนด์"</strong> (มีแถบไฮไลท์สีเขียวแนะนำคำตอบให้เห็น)
              </div>
              <button
                onClick={onScrollToAutopsy}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-black bg-purple-300 hover:bg-purple-200 transition shadow-md flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>เลื่อนไปตอบคำถาม</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Step 6: COMPLETED */}
          {currentStep === 'COMPLETED' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/50">
              <div className="text-xs text-slate-200 leading-relaxed">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>🏆 ยอดเยี่ยม! ผ่านด่านพิเศษ (สำเร็จหลักสูตรปฐมนิเทศ CSI) แล้ว!</span>
                </div>
                คุณเข้าใจขั้นตอนการสืบสวนนิติเวชครบทุกกระบวนการแล้ว พร้อมออกปฏิบัติหน้าที่ในคดีสืบสวนจริงทั้ง 5 คดีแล้ว กดปุ่มเพื่อลุยคดีที่ 2 ได้เลย!
              </div>
              <button
                onClick={onProceedNext}
                className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 transition shadow-[0_0_15px_rgba(52,211,153,0.4)] flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>ลุยคดีสืบสวนจริงด่านที่ 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Progress Tracker Mini Dots */}
          <div className="flex items-center justify-between pt-1 border-t border-amber-500/20 text-[10px] text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span>ความคืบหน้าการฝึก:</span>
              <span className={`w-2 h-2 rounded-full ${hasClue1 ? 'bg-emerald-400' : 'bg-slate-700'}`} title="จุดที่ 1 (แก้วน้ำ)" />
              <span className={`w-2 h-2 rounded-full ${hasClue2 ? 'bg-emerald-400' : 'bg-slate-700'}`} title="จุดที่ 2 (ริมฝีปาก)" />
              <span className={`w-2 h-2 rounded-full ${hasClue3 ? 'bg-emerald-400' : 'bg-slate-700'}`} title="จุดที่ 3 (ซองฟอยล์)" />
              <span className={`w-2 h-2 rounded-full ${allCluesCollected ? 'bg-emerald-400' : 'bg-slate-700'}`} title="ตรวจศพ" />
              <span className={`w-2 h-2 rounded-full ${isCaseSolved ? 'bg-emerald-400' : 'bg-slate-700'}`} title="วินิจฉัย" />
            </div>
            <span className="text-amber-300/80">
              {allCluesCollected && !isCaseSolved ? 'หลักฐานครบแล้ว! เตรียมวินิจฉัย' : isCaseSolved ? 'ผ่านด่านฝึกหัดแล้ว' : 'กำลังค้นหาหลักฐาน'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

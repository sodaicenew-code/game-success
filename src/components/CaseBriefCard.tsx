import React from 'react';
import { Volume2, VolumeX, Search, CheckCheck, User, Shirt, MapPin } from 'lucide-react';
import { CaseStage } from '../types';

interface CaseBriefCardProps {
  caseData: CaseStage;
  collectedCount: number;
  totalClues: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenVictimFile: () => void;
}

export const CaseBriefCard: React.FC<CaseBriefCardProps> = ({
  caseData,
  collectedCount,
  totalClues,
  soundEnabled,
  onToggleSound,
  onOpenVictimFile,
}) => {
  const isComplete = collectedCount === totalClues;
  const isMale = caseData.victim.gender === 'ชาย';

  return (
    <section className="bg-[#111726] border border-[#23304d] rounded-2xl p-4 shadow-xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Tag line & Audio toggle */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-900 text-cyan-400 font-semibold border border-cyan-500/30 tracking-wider">
            {caseData.code}
          </span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-red-950/70 text-red-300 font-medium border border-red-800/40">
            {caseData.tag}
          </span>
          {/* Gender & Role Badge */}
          <span className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
            isMale
              ? 'bg-blue-950/70 text-blue-300 border-blue-800/40'
              : 'bg-rose-950/70 text-rose-300 border-rose-800/40'
          }`}>
            <User className="w-3 h-3" />
            <span>เพศ: {caseData.victim.gender} ({caseData.victim.age})</span>
          </span>
        </div>

        <button
          onClick={onToggleSound}
          className={`p-2 rounded-xl border transition-all ${
            soundEnabled
              ? 'text-cyan-400 bg-slate-900/80 border-[#23304d] hover:border-cyan-400/50 hover:bg-slate-800'
              : 'text-slate-500 bg-slate-900/40 border-slate-800 hover:text-slate-400'
          }`}
          title={soundEnabled ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Title & Brief */}
      <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mb-1.5">
        {caseData.title}
      </h2>
      <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-3">
        {caseData.brief}
      </p>

      {/* Victim & Attire Summary Box */}
      <div className="bg-[#0b0f1a] border border-slate-800 rounded-xl p-3 mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* Clothing Overview */}
        <div className="flex items-start gap-2 text-slate-300">
          <Shirt className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">เครื่องแต่งกายผู้ตาย:</span>
            <span className="text-slate-200 line-clamp-1">{caseData.victim.clothing}</span>
          </div>
        </div>

        {/* Environment Overview */}
        <div className="flex items-start gap-2 text-slate-300">
          <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">สภาพสถานที่เกิดเหตุ:</span>
            <span className="text-slate-200 line-clamp-1">{caseData.environmentDesc}</span>
          </div>
        </div>

        {/* Quick action button for full file */}
        <div className="sm:col-span-2 pt-1 border-t border-slate-800/60 flex justify-end">
          <button
            onClick={onOpenVictimFile}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
          >
            <User className="w-3 h-3" />
            <span>เปิดอ่านแฟ้มข้อมูลศพ เสื้อผ้า และสภาพแวดล้อมฉบับเต็ม →</span>
          </button>
        </div>
      </div>

      {/* Clue Discovery Status Footer */}
      <div className="pt-2 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Search className="w-4 h-4 text-cyan-400" />
          <span>ค้นพบเบาะแส:</span>
          <span className="font-bold text-cyan-400 font-tech text-sm">
            {collectedCount} / {totalClues}
          </span>
        </div>

        {isComplete ? (
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-medium">
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            เบาะแสครบแล้ว! ปลดล็อกการชันสูตร
          </span>
        ) : (
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            กำลังสำรวจ ({collectedCount}/{totalClues})
          </span>
        )}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Briefcase, HelpCircle, Coffee, Skull, Pill, Scissors, Activity, Droplets, Wind, AlertTriangle, Droplet, Flame, Shield, Heart, Zap, Info } from 'lucide-react';
import { CaseStage, Clue } from '../types';

interface EvidenceTrayProps {
  caseData: CaseStage;
  collectedClues: Set<string>;
  onInspectClue: (clue: Clue) => void;
}

export const EvidenceTray: React.FC<EvidenceTrayProps> = ({
  caseData,
  collectedClues,
  onInspectClue,
}) => {
  const [activeHintId, setActiveHintId] = useState<string | null>(null);

  const renderClueIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-5 h-5" />;
      case 'Skull':
        return <Skull className="w-5 h-5" />;
      case 'Pill':
        return <Pill className="w-5 h-5" />;
      case 'Scissors':
        return <Scissors className="w-5 h-5" />;
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5" />;
      case 'Wind':
        return <Wind className="w-5 h-5" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5" />;
      case 'Droplet':
        return <Droplet className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Shield':
        return <Shield className="w-5 h-5" />;
      case 'Heart':
        return <Heart className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      default:
        return <Briefcase className="w-5 h-5" />;
    }
  };

  return (
    <section className="bg-[#111726] border border-[#23304d] rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 font-tech">
          <Briefcase className="w-4 h-4 text-cyan-400" />
          กระเป๋าเก็บวัตถุพยาน (COLLECTED EVIDENCE)
        </h3>
        <span className="text-[11px] text-slate-400">
          ค้นพบ {caseData.clues.filter(c => collectedClues.has(c.id)).length}/{caseData.clues.length} ชิ้น
        </span>
      </div>

      {/* 3 Slots Grid */}
      <div className="grid grid-cols-3 gap-3">
        {caseData.clues.map((clue, idx) => {
          const isCollected = collectedClues.has(clue.id);
          const isHintActive = activeHintId === clue.id;

          if (isCollected) {
            return (
              <button
                key={clue.id}
                onClick={() => onInspectClue(clue)}
                className="group relative p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.15)] flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] cursor-pointer"
              >
                <div className="absolute top-1.5 right-2 px-1 rounded bg-amber-400 text-black font-mono font-black text-[9px]">
                  #{String(idx + 1).padStart(2, '0')}
                </div>

                <div className="w-9 h-9 rounded-xl bg-cyan-900/60 text-cyan-300 flex items-center justify-center mb-1.5 shadow-sm group-hover:text-cyan-200 group-hover:bg-cyan-800/80 transition-colors">
                  {renderClueIcon(clue.icon)}
                </div>
                <span className="text-xs font-bold text-slate-100 line-clamp-1 w-full">
                  {clue.short}
                </span>
                <span className="text-[9.5px] text-cyan-300 group-hover:text-amber-300 mt-1 px-1.5 py-0.5 rounded bg-cyan-950/80 group-hover:bg-amber-950/80 border border-cyan-500/40 group-hover:border-amber-400/50 font-mono flex items-center gap-1 transition-colors">
                  <span>🔍 ตรวจสอบละเอียด</span>
                </span>
              </button>
            );
          }

          return (
            <div
              key={clue.id}
              onClick={() => setActiveHintId(isHintActive ? null : clue.id)}
              className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/90 hover:border-amber-500/50 text-slate-500 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-slate-900/80 select-none group/slot"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-800/60 flex items-center justify-center mb-1.5 text-slate-500 group-hover/slot:text-amber-400 group-hover/slot:bg-slate-800 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-300">
                วัตถุพยาน #{String(idx + 1).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-amber-400/90 mt-0.5 flex items-center gap-0.5 group-hover/slot:underline font-mono">
                <Info className="w-2.5 h-2.5" />
                {isHintActive ? 'ปิดคำใบ้' : 'แตะดูเบาะแส'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Hint Banner if player taps an undiscovered slot */}
      {activeHintId && (
        <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs flex items-start gap-2 animate-fadeIn">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-amber-300 font-mono">
              เบาะแสร่องรอยต้องสงสัย:
            </span>{' '}
            <span>
              {caseData.clues.find(c => c.id === activeHintId)?.blemish?.hint ||
                'มองหารอยคราบเลือด หรือผงสารเคมีในสถานที่เกิดเหตุ'}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

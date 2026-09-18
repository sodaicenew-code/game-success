import React from 'react';
import { BookOpen, X, Sparkles, CheckCircle2, Search, Crosshair, UserCheck, Stethoscope, ArrowRight } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTutorial: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onStartTutorial,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      icon: Search,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
      title: 'สำรวจสถานที่เกิดเหตุ (Scan Scene)',
      desc: 'สังเกตดูรูปถ่ายสถานที่เกิดเหตุจริง กวาดสายตามองหาสิ่งผิดปกติและร่องรอยต้องสงสัย เช่น แก้วน้ำ, ร่างเหยื่อ, หรือวัตถุตกหล่นบนพื้น',
    },
    {
      num: '02',
      icon: Crosshair,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30',
      title: 'คลิกเก็บพยานหลักฐาน & ปักหมุด CSI',
      desc: 'แตะหรือคลิกที่วัตถุในภาพโดยตรง เมื่อพบถูกต้อง ระบบจะปักป้ายเต็นท์สีเหลือง CSI Marker (#01, #02, #03) พร้อมรายงานผลการตรวจพิสูจน์ทันที',
    },
    {
      num: '03',
      icon: UserCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      title: 'ตรวจข้อมูลศพ & สภาพเสื้อผ้า',
      desc: 'คลิกปุ่ม "ตรวจข้อมูลศพ/เสื้อผ้า" เพื่ออ่านประวัติผู้ตาย บาดแผลภายนอก สภาพเครื่องแต่งกาย และสัญญาณชีวภาพก่อนเสียชีวิต',
    },
    {
      num: '04',
      icon: Stethoscope,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/30',
      title: 'วินิจฉัยชันสูตรสาเหตุการตาย (Autopsy Quiz)',
      desc: 'เมื่อเก็บหลักฐานครบทั้ง 3 ชิ้น กล่องวิเคราะห์จะปลดล็อก ให้อ่านสรุปผลและเลือกลงความเห็นสาเหตุการเสียชีวิตตามหลักนิติเวชศาสตร์',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f1525] border-2 border-cyan-500/60 max-w-xl w-full rounded-2xl p-5 md:p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] relative max-h-[90vh] flex flex-col overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                FORENSIC PROTOCOL
              </span>
              <span className="text-[11px] text-amber-300 font-mono flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                มีระบบสอนทำทีละจุดในด่านที่ 1
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              คู่มือและวิธีเล่นเกมนิติเวชสืบสวน
            </h2>
          </div>
        </div>

        {/* Content Scrollable */}
        <div className="overflow-y-auto space-y-3 pr-1 text-slate-200">
          {/* Introductory Mission Box */}
          <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-slate-300 leading-relaxed">
            <p className="font-semibold text-cyan-300 mb-1">
              👮 ยินดีต้อนรับสู่บทบาทเจ้าหน้าที่พิสูจน์หลักฐาน CSI:
            </p>
            ภารกิจของคุณคือการไขปริศนาการเสียชีวิตทั้ง 6 ด่าน โดยเริ่มจาก <strong className="text-amber-300">ด่านพิเศษฝึกอบรม</strong> ซึ่งจะมีระบบไกด์นำทางชี้เป้าบอกแต่ละจุดแบบจับมือทำจนจบด่าน
          </div>

          {/* 4 Core Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-3 rounded-xl bg-[#131b2e] border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        ขั้นตอนที่ {step.num}
                      </span>
                      <div className={`p-1.5 rounded-lg border ${step.bg}`}>
                        <Icon className={`w-4 h-4 ${step.color}`} />
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tutorial Highlight Banner */}
          <div className="p-3 bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 border border-amber-500/40 rounded-xl text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-amber-200/90">
              <strong className="text-amber-300">ด่านที่ 1 เป็นด่านสอนเล่นพิเศษ:</strong> จะมีแถบผู้ช่วยแนะนำขั้นตอน พร้อมลูกศรชี้เป้าลงบนภาพสถานที่เกิดเหตุทีละจุด จนกว่าจะเก็บครบและตอบคำถามสำเร็จ!
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-3 border-t border-slate-800 flex flex-wrap items-center justify-end gap-2.5 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition cursor-pointer"
          >
            เข้าใจแล้ว ปิดหน้าต่าง
          </button>
          <button
            onClick={() => {
              onStartTutorial();
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center gap-1.5 cursor-pointer"
          >
            <span>เริ่มด่านพิเศษ (สอนทำบอกแต่ละจุด)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

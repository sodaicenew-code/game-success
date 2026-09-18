import React from 'react';
import { X, User, Shirt, MapPin, Activity, AlertCircle, Compass, Sparkles, Skull, Crosshair, HelpCircle, Search } from 'lucide-react';
import { CaseStage } from '../types';

interface VictimInspectorModalProps {
  caseData: CaseStage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VictimInspectorModal: React.FC<VictimInspectorModalProps> = ({
  caseData,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !caseData) return null;

  const { victim } = caseData;
  const isMale = victim.gender === 'ชาย';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0d121f] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#070b14]/90">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border ${
              isMale
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 font-semibold">{caseData.code}</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  {caseData.tag}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
                แฟ้มข้อมูลผู้เสียชีวิตและเครื่องแต่งกาย
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
          {/* Top Demographic Summary Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#131b2e] border border-slate-800 rounded-xl p-3.5">
            {/* Gender Card */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                isMale
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {isMale ? '♂' : '♀'}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">เพศ (Gender)</span>
                <span className={`font-bold text-sm ${isMale ? 'text-blue-300' : 'text-rose-300'}`}>
                  {victim.gender} ({victim.genderEn})
                </span>
              </div>
            </div>

            {/* Age & Identity */}
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">อายุ (Age)</span>
              <span className="font-bold text-white text-sm">{victim.age}</span>
              <span className="text-[11px] text-slate-400 block truncate">{victim.role}</span>
            </div>

            {/* Name */}
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">ชื่อ-สกุล (Name)</span>
              <span className="font-bold text-cyan-300 text-sm block truncate">{victim.name}</span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ระบุตัวบุคคลสำเร็จ
              </span>
            </div>
          </div>

          {/* Forensic Trauma & Wound Analysis (User Request: วิเคราะห์บาดแผลว่าน่าจะเสียชีวิตเพราะอะไร หรือน่าจะโดนจากอะไรถ้าโดนฆ่า เผื่อหาของไม่เจอ) */}
          {victim.woundAnalysis && (
            <div className="bg-gradient-to-b from-[#181124] to-[#120e1d] border-2 border-purple-500/50 rounded-xl p-4 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-purple-500/30 pb-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <Skull className="w-4 h-4 text-purple-400" />
                  <span>การวิเคราะห์บาดแผลและสาเหตุการเสียชีวิต (Forensic Trauma & Wound Analysis)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40">
                  AUTOPSY REPORT
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {/* Primary Wound */}
                <div className="p-3 rounded-lg bg-black/40 border border-purple-500/30">
                  <span className="text-[11px] font-mono text-purple-400 font-bold flex items-center gap-1 mb-1">
                    <Crosshair className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    ลักษณะบาดแผลหลักที่ตรวจพบ:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {victim.woundAnalysis.primaryWound}
                  </p>
                </div>

                {/* Weapon / Agent */}
                <div className="p-3 rounded-lg bg-black/40 border border-purple-500/30">
                  <span className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1 mb-1">
                    <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    อาวุธ/สารก่อเหตุที่คาดว่าใช้:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {victim.woundAnalysis.weaponOrAgent}
                  </p>
                </div>
              </div>

              {/* Mechanism of Death Hypothesis */}
              <div className="p-3 rounded-lg bg-black/50 border border-purple-500/30">
                <span className="text-[11px] font-mono text-rose-400 font-bold block mb-1">
                  ข้อสันนิษฐานกลไกและพฤติการณ์การเสียชีวิต (Manner & Mechanism of Death):
                </span>
                <p className="text-xs text-rose-100 leading-relaxed">
                  {victim.woundAnalysis.mannerHypothesis}
                </p>
              </div>

              {/* Clue Finding Guide for Players */}
              {victim.woundAnalysis.clueFindingGuide && (
                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/50">
                  <span className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1 mb-1">
                    <Search className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    คู่มือชี้เป้าหาวัตถุพยานในที่เกิดเหตุ (สำหรับช่วยผู้เล่นเมื่อหาของไม่เจอ):
                  </span>
                  <p className="text-xs text-amber-100 font-medium leading-relaxed">
                    {victim.woundAnalysis.clueFindingGuide}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Clothing & Attire Analysis */}
          <div className="bg-[#111728] border border-cyan-500/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold border-b border-slate-800 pb-2">
              <Shirt className="w-4 h-4 text-cyan-400" />
              <span>การตรวจสภาพเครื่องแต่งกายและเสื้อผ้า (Forensic Clothing Examination)</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200">
                <span className="text-[11px] text-cyan-400 font-mono block mb-1 font-semibold">
                  ชุดที่สวมใส่ขณะเสียชีวิต:
                </span>
                <p className="leading-relaxed font-medium">{victim.clothing}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-mono block mb-1.5">
                  ร่องรอยและวัตถุพยานที่ตรวจพบบนเนื้อผ้า:
                </span>
                <div className="space-y-1.5">
                  {victim.clothingDetails.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 rounded-md bg-slate-900/50 border border-slate-800/80 text-xs text-slate-300"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Body Position & Pathological Signs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Position */}
            <div className="bg-[#111728] border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs border-b border-slate-800 pb-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>ท่าทางและตำแหน่งสภาพศพ (Body Position)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {victim.bodyPosition}
              </p>
            </div>

            {/* Pathological Signs */}
            <div className="bg-[#111728] border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs border-b border-slate-800 pb-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                <span>พยาธิสภาพภายนอกแรกพบ (Initial Signs)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {victim.initialSigns}
              </p>
            </div>
          </div>

          {/* Location & Environment Background */}
          <div className="bg-[#111728] border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs border-b border-slate-800 pb-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>สภาพแวดล้อมสถานที่เกิดเหตุ (Crime Scene Environment)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {caseData.environmentDesc}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#070b14] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>หลักฐานบันทึกเข้าสำนวนคดีอัตโนมัติ</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
          >
            รับทราบและปิด
          </button>
        </div>
      </div>
    </div>
  );
};

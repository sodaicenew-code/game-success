import React, { useState } from 'react';
import {
  X, Microscope, Check, Coffee, Skull, Pill, Scissors, Activity, Droplets, Wind,
  AlertTriangle, Droplet, Flame, Shield, Heart, Zap, ZoomIn, ZoomOut, Sparkles,
  Crosshair, Sun, Eye, Fingerprint, Dna, FileText, ChevronRight, Search
} from 'lucide-react';
import { Clue, ForensicTrace } from '../types';
import { getClueForensicTraces } from '../data/forensicTraces';

interface EvidenceModalProps {
  clue: Clue | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ clue, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1); // Default to full clear 1x view, zoom only when user requests deep inspection
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);
  const [isUvLightActive, setIsUvLightActive] = useState<boolean>(false);

  if (!clue) return null;

  const traces: ForensicTrace[] = getClueForensicTraces(clue);
  const activeTrace = traces.find(t => t.id === selectedTraceId) || traces[0];

  const renderModalIcon = (name: string) => {
    switch (name) {
      case 'Coffee':
        return <Coffee className="w-6 h-6" />;
      case 'Skull':
        return <Skull className="w-6 h-6" />;
      case 'Pill':
        return <Pill className="w-6 h-6" />;
      case 'Scissors':
        return <Scissors className="w-6 h-6" />;
      case 'Activity':
        return <Activity className="w-6 h-6" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6" />;
      case 'Wind':
        return <Wind className="w-6 h-6" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-6 h-6" />;
      case 'Droplet':
        return <Droplet className="w-6 h-6" />;
      case 'Flame':
        return <Flame className="w-6 h-6" />;
      case 'Shield':
        return <Shield className="w-6 h-6" />;
      case 'Heart':
        return <Heart className="w-6 h-6" />;
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      default:
        return <Microscope className="w-6 h-6" />;
    }
  };

  const getTraceIcon = (type: ForensicTrace['type']) => {
    switch (type) {
      case 'blood':
        return <Droplet className="w-3 h-3 text-red-400" />;
      case 'chemical':
        return <Sparkles className="w-3 h-3 text-amber-400" />;
      case 'fingerprint':
        return <Fingerprint className="w-3 h-3 text-cyan-400" />;
      case 'burn':
        return <Flame className="w-3 h-3 text-orange-400" />;
      case 'cyanosis':
        return <Heart className="w-3 h-3 text-purple-400" />;
      default:
        return <Crosshair className="w-3 h-3 text-emerald-400" />;
    }
  };

  const getTraceBadgeColor = (type: ForensicTrace['type']) => {
    switch (type) {
      case 'blood':
        return 'bg-red-950 text-red-300 border-red-500/50';
      case 'chemical':
        return 'bg-amber-950 text-amber-300 border-amber-500/50';
      case 'fingerprint':
        return 'bg-cyan-950 text-cyan-300 border-cyan-500/50';
      case 'burn':
        return 'bg-orange-950 text-orange-300 border-orange-500/50';
      case 'cyanosis':
        return 'bg-purple-950 text-purple-300 border-purple-500/50';
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/50';
    }
  };

  // Transform origin aligns with selected trace pin if zoomed
  const transformOrigin = activeTrace && zoomLevel > 1
    ? `${activeTrace.pinX}% ${activeTrace.pinY}%`
    : '50% 50%';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b1224] border-2 border-cyan-500/60 max-w-xl w-full rounded-2xl p-4 sm:p-5 shadow-[0_0_40px_rgba(0,242,254,0.3)] relative max-h-[94vh] flex flex-col overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-3 shrink-0">
          <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 flex items-center justify-center shadow-[0_0_12px_rgba(0,242,254,0.25)] shrink-0">
            {renderModalIcon(clue.icon)}
          </div>
          <div className="pr-8">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold flex items-center gap-1">
                <Microscope className="w-3 h-3 text-amber-400" />
                โหมดตรวจสอบละเอียด (FORENSIC INSPECTION)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/30">
                {clue.forensicCategory}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white leading-tight mt-0.5">
              {clue.name}
            </h4>
          </div>
        </div>

        {/* Scrollable Forensic Content */}
        <div className="overflow-y-auto space-y-3 pr-1 text-slate-200">
          {/* 1. Incident Relation Status or Cause of Death Hypothesis */}
          {clue.isRelatedToIncident === false ? (
            <div className="bg-slate-900/95 p-3.5 rounded-xl border-2 border-slate-700 shadow-md space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-xs font-bold border border-slate-600 flex items-center gap-1.5">
                  <span className="text-rose-400 font-bold">✕</span> ของนี้ไม่เกี่ยวกับเหตุการณ์
                </span>
                <span className="text-[10px] text-slate-400 font-mono">(ตัดประเด็นความเกี่ยวข้อง)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {clue.unrelatedExplanation || 'ของนี้ไม่เกี่ยวกับเหตุการณ์: ผลการตรวจพิสูจน์ทางนิติวิทยาศาสตร์ ไม่พบสารพิษ คราบเลือด หรือร่องรอยการต่อสู้ เป็นของใช้ประจำวันตามปกติในสถานที่เกิดเหตุ และไม่มีความเชื่อมโยงกับสาเหตุการเสียชีวิต'}
              </p>
            </div>
          ) : (
            clue.causeOfDeathHypothesis && (
              <div className="bg-gradient-to-r from-amber-950/70 via-cyan-950/60 to-slate-900 p-3.5 rounded-xl border-2 border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.2)] space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono text-xs font-black flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    ข้อสันนิษฐานสาเหตุการเสียชีวิต
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">
                    (CAUSE OF DEATH HYPOTHESIS)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-100 font-bold leading-relaxed">
                  {clue.causeOfDeathHypothesis}
                </p>
              </div>
            )
          )}

          {/* Forensic Close-up Photograph Viewport */}
          {clue.evidenceImage ? (
            <div className="relative rounded-xl overflow-hidden border-2 border-slate-700 bg-black group/img">
              {/* Photo Container */}
              <div className="relative w-full h-56 sm:h-64 overflow-hidden flex items-center justify-center bg-[#070b14] select-none">
                <img
                  src={clue.evidenceImage}
                  alt={clue.name}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: transformOrigin,
                  }}
                  className={`w-full h-full ${
                    zoomLevel === 1 ? 'object-contain p-1' : 'object-cover'
                  } transition-all duration-300 ease-out ${
                    isUvLightActive
                      ? 'filter hue-rotate-180 brightness-125 contrast-150 saturate-200'
                      : ''
                  }`}
                  onClick={() => {
                    setZoomLevel(prev => (prev === 1 ? 2.5 : prev === 2.5 ? 4 : 1));
                  }}
                />

                {/* Reticle & Optical Vignette */}
                <div className="absolute inset-0 pointer-events-none border border-cyan-500/30 rounded-xl" />
                {zoomLevel > 1 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                )}

                {/* UV Mode Active Glow Banner */}
                {isUvLightActive && (
                  <div className="absolute top-2 left-2 pointer-events-none bg-purple-950/90 border border-purple-400 text-purple-200 text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow-[0_0_15px_rgba(168,85,247,0.7)] flex items-center gap-1 animate-pulse">
                    <Sun className="w-3 h-3 text-purple-300" />
                    <span>UV 365nm (ALS FLUORESCENCE ACTIVE)</span>
                  </div>
                )}

                {/* Forensic Scale Ruler (10 mm / 1 cm) in corner */}
                <div className="absolute bottom-2.5 left-2.5 pointer-events-none flex items-center gap-1.5 bg-black/85 backdrop-blur-sm px-2 py-1 rounded border border-slate-600/80 text-[9px] font-mono text-slate-200 shadow-md">
                  <div className="w-10 h-1.5 bg-white flex items-center justify-between border-l-2 border-r-2 border-red-600">
                    <span className="w-[1px] h-full bg-black mx-auto" />
                  </div>
                  <span className="font-bold text-amber-300">10 mm (1 cm)</span>
                </div>

                {/* VISIBLE FORENSIC TRACES HOTSPOTS ON ZOOM */}
                {zoomLevel > 1 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {traces.map((trace, idx) => {
                      const isSelected = activeTrace?.id === trace.id;
                      return (
                        <div
                          key={trace.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer z-30"
                          style={{
                            left: `${trace.pinX}%`,
                            top: `${trace.pinY}%`,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTraceId(trace.id);
                          }}
                        >
                          {/* Pulsing Beacon */}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-black font-black scale-125 shadow-[0_0_20px_rgba(251,191,36,0.9)] ring-2 ring-white'
                              : 'bg-black/90 text-amber-400 border-2 border-amber-400 hover:scale-110 shadow-lg'
                          }`}>
                            <span className="text-[10px] font-mono font-bold">#{idx + 1}</span>
                          </div>

                          {/* Trace Callout Tag attached to pin */}
                          {isSelected && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#090e1c]/95 border-2 border-amber-400 px-2.5 py-1 rounded-md text-[10px] font-mono text-amber-200 whitespace-nowrap shadow-[0_0_20px_rgba(0,0,0,0.9)] flex items-center gap-1.5 animate-fadeIn">
                              {getTraceIcon(trace.type)}
                              <span className="font-bold text-white">{trace.name}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Interactive Controls Overlay in Top Right (UV & Zoom Levels) */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
                  {/* UV / ALS Light Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUvLightActive(!isUvLightActive);
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-medium flex items-center gap-1 backdrop-blur-md border transition cursor-pointer shadow-md ${
                      isUvLightActive
                        ? 'bg-purple-600 text-white border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.8)] font-bold'
                        : 'bg-black/80 text-purple-300 border-purple-500/50 hover:bg-purple-950/80'
                    }`}
                    title="ส่องตรวจด้วยแสงอุลตราไวโอเลต / นิติเวช (ALS)"
                  >
                    <Sun className="w-3 h-3 text-purple-300" />
                    <span>แสง UV</span>
                  </button>

                  {/* Zoom Level Switchers */}
                  <div className="flex items-center bg-black/90 rounded-md border border-cyan-500/60 p-0.5 text-[10px] font-mono shadow-md">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomLevel(1);
                      }}
                      className={`px-2 py-0.5 rounded transition ${
                        zoomLevel === 1 ? 'bg-cyan-500 text-black font-bold' : 'text-slate-300 hover:text-white'
                      }`}
                      title="ดูภาพรวมขนาดปกติ"
                    >
                      1x ภาพรวม
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomLevel(2.5);
                      }}
                      className={`px-2 py-0.5 rounded transition flex items-center gap-1 ${
                        zoomLevel === 2.5 ? 'bg-amber-400 text-black font-bold shadow-sm' : 'text-amber-300 hover:text-white'
                      }`}
                      title="ซูมส่องขยายตรวจร่องรอยละเอียด"
                    >
                      <Search className="w-2.5 h-2.5" />
                      <span>2.5x ตรวจสอบละเอียด</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomLevel(4);
                      }}
                      className={`px-1.5 py-0.5 rounded transition ${
                        zoomLevel === 4 ? 'bg-purple-400 text-black font-bold' : 'text-slate-300 hover:text-white'
                      }`}
                      title="ซูมระดับจุลทรรศน์ 4 เท่า"
                    >
                      4x จุลทรรศน์
                    </button>
                  </div>
                </div>
              </div>

              {/* Forensic Label Bar under photo */}
              <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                  {zoomLevel > 1 ? (
                    <span>โหมดส่องขยายร่องรอยความละเอียดสูง ({zoomLevel}x)</span>
                  ) : (
                    <span className="text-slate-300">ภาพถ่ายวัตถุพยานมุมมองปกติ (1x)</span>
                  )}
                </span>
                <span className="text-amber-400 font-bold">
                  {zoomLevel > 1 ? `ตรวจพบร่องรอยสำคัญ ${traces.length} จุด` : 'แตะปุ่ม "ซูมดูรายละเอียดแบบเจาะลึก" ด้านล่าง'}
                </span>
              </div>
            </div>
          ) : (
            /* Fallback badge preview */
            <div className="w-full h-24 rounded-xl bg-[#070b14] border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="p-3 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                {renderModalIcon(clue.icon)}
              </div>
              <span className="text-[11px] font-mono text-cyan-400 mt-1 font-semibold">
                {clue.short}
              </span>
            </div>
          )}

          {/* Dedicated Deep Inspection Zoom Action Bar */}
          {clue.evidenceImage && (
            <div className="my-1">
              {zoomLevel === 1 ? (
                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/40 via-cyan-950/40 to-slate-900 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 text-xs text-amber-200">
                    <Eye className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>มุมมองปกติเห็นวัตถุชัดเจน — หากต้องการส่องตรวจคราบ/สารพิษตกค้างระดับไมโคร</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(2.5)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 text-slate-950 font-black text-xs font-mono flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(251,191,36,0.4)] cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0"
                  >
                    <Search className="w-4 h-4 text-black" />
                    <span>ซูมดูรายละเอียดแบบเจาะลึก (2.5x)</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-950/70 border-2 border-amber-400/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                  <div className="flex items-center gap-2 text-xs text-amber-200">
                    <Microscope className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                    <span>
                      <strong>โหมดซูมเจาะลึก ({zoomLevel}x):</strong> ตรวจพบร่องรอย {traces.length} จุด (แตะหมุดบนภาพหรือแท็บด้านล่าง)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                    <button
                      type="button"
                      onClick={() => setZoomLevel(zoomLevel === 2.5 ? 4 : 2.5)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono flex items-center gap-1 cursor-pointer transition"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>{zoomLevel === 2.5 ? '4x จุลทรรศน์' : '2.5x'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(1)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono flex items-center gap-1 border border-slate-600 cursor-pointer transition"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                      <span>↩ ดูภาพเต็ม (1x)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VISIBLE TRACES SUMMARY & SELECTOR WHEN ZOOMED */}
          {traces.length > 0 && (
            <div className="bg-[#090e1c] p-3 rounded-xl border border-amber-500/40 shadow-sm space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 font-mono">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>ร่องรอยนิติเวชที่ตรวจพบขณะส่องขยาย (Forensic Traces):</span>
                </h5>
                <span className="text-[10px] font-mono text-slate-400">
                  คลิกเพื่อดูจุดตรวจ #{traces.findIndex(t => t.id === activeTrace?.id) + 1}
                </span>
              </div>

              {/* Trace Selection Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {traces.map((trace, idx) => {
                  const isSelected = activeTrace?.id === trace.id;
                  return (
                    <button
                      key={trace.id}
                      onClick={() => {
                        setSelectedTraceId(trace.id);
                        if (zoomLevel === 1) setZoomLevel(2.5);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-black font-bold shadow-[0_0_12px_rgba(251,191,36,0.5)] scale-105'
                          : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-black/40 flex items-center justify-center text-[9px]">
                        {idx + 1}
                      </span>
                      <span>{trace.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Trace Detail Card */}
              {activeTrace && (
                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-700/80 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      {getTraceIcon(activeTrace.type)}
                      <span className="font-bold text-white font-mono">{activeTrace.name}</span>
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${getTraceBadgeColor(activeTrace.type)}`}>
                      {activeTrace.locationLabel}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {activeTrace.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Clear Suspicious Visual Cue Callout */}
          {clue.suspiciousVisualCue && (
            <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-500/40 shadow-sm">
              <h5 className="text-[11px] font-bold text-amber-300 mb-1 flex items-center gap-1 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>ลักษณะผิดปกติเด่นชัดที่สังเกตได้บนวัตถุ:</span>
              </h5>
              <p className="text-xs text-amber-100 font-medium leading-relaxed">
                {clue.suspiciousVisualCue}
              </p>
            </div>
          )}

          {/* Close-up / Microscopic Trauma Findings */}
          {clue.closeUpAnalysis && (
            <div className="bg-cyan-950/30 p-3 rounded-xl border border-cyan-500/40 shadow-sm">
              <h5 className="text-[11px] font-bold text-cyan-300 mb-1 flex items-center gap-1.5 font-mono">
                <Microscope className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>ผลการส่องกล้องขยาย & ตรวจพิสูจน์ทางวิทยาศาสตร์:</span>
              </h5>
              <p className="text-xs text-cyan-100/90 leading-relaxed">
                {clue.closeUpAnalysis}
              </p>
            </div>
          )}

          {/* Crime Scene Location / Blemish Context */}
          {clue.blemish && (
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <h5 className="text-[11px] font-bold text-slate-300 mb-1 font-mono">
                ตำแหน่งที่ตรวจพบบริเวณจุดเกิดเหตุ:
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {clue.blemish.sublabel || clue.blemish.label}
              </p>
            </div>
          )}

          {/* Physical Description */}
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
            <h5 className="text-[11px] font-bold text-slate-400 mb-1 font-mono">
              ลักษณะทางกายภาพ:
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              {clue.desc}
            </p>
          </div>

          {/* Scientific Lab Analysis */}
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
            <h5 className="text-[11px] font-bold text-slate-400 mb-1 font-mono">
              ผลวิเคราะห์สารและพยานหลักฐาน:
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {clue.details}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 mt-2 border-t border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 text-slate-950 font-bold text-xs tracking-wider uppercase hover:opacity-95 transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>บันทึกผลการตรวจลงแฟ้มสำนวนคดี</span>
          </button>
        </div>
      </div>
    </div>
  );
};

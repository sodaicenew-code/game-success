import React, { useState, useRef } from 'react';
import {
  Crosshair, Microscope, Trash2, X, Move, Sparkles, Check,
  AlertCircle, ShieldCheck, Tag, Info, ArrowRight, CornerDownRight, Search
} from 'lucide-react';
import { ForensicBoundingBox } from '../types';

interface ForensicBoundingBoxLayerProps {
  boxes: ForensicBoundingBox[];
  selectedBoxId: string | null;
  isDrawMode: boolean;
  isMoveMode: boolean;
  isVisible: boolean;
  onSelectBox: (box: ForensicBoundingBox | null) => void;
  onUpdateBox: (updatedBox: ForensicBoundingBox) => void;
  onCreateBox: (newBox: ForensicBoundingBox) => void;
  onDeleteBox?: (boxId: string) => void;
  onInspectDeep: (box: ForensicBoundingBox) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const ForensicBoundingBoxLayer: React.FC<ForensicBoundingBoxLayerProps> = ({
  boxes,
  selectedBoxId,
  isDrawMode,
  isMoveMode,
  isVisible,
  onSelectBox,
  onUpdateBox,
  onCreateBox,
  onDeleteBox,
  onInspectDeep,
  containerRef,
}) => {
  // State for drawing new box
  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null);
  const [drawingCurrent, setDrawingCurrent] = useState<{ x: number; y: number } | null>(null);

  // State for dragging an existing box
  const [draggingBoxId, setDraggingBoxId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const selectedBox = boxes.find(b => b.id === selectedBoxId) || null;

  // Convert client coordinate to percentage relative to container
  const getContainerPercent = (clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  };

  // Pointer Handlers for Drawing New Box
  const handleLayerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawMode) return;
    e.stopPropagation();
    const coords = getContainerPercent(e.clientX, e.clientY);
    setDrawingStart(coords);
    setDrawingCurrent(coords);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handleLayerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // 1. Drawing box
    if (isDrawMode && drawingStart) {
      const coords = getContainerPercent(e.clientX, e.clientY);
      setDrawingCurrent(coords);
      return;
    }

    // 2. Dragging existing box marker
    if (isMoveMode && draggingBoxId) {
      const coords = getContainerPercent(e.clientX, e.clientY);
      const targetBox = boxes.find(b => b.id === draggingBoxId);
      if (!targetBox) return;

      const newCenterX = coords.x - dragOffset.x;
      const newCenterY = coords.y - dragOffset.y;
      const newX = Math.max(0, Math.min(100 - targetBox.width, newCenterX - targetBox.width / 2));
      const newY = Math.max(0, Math.min(100 - targetBox.height, newCenterY - targetBox.height / 2));

      onUpdateBox({
        ...targetBox,
        x: Math.round(newX * 10) / 10,
        y: Math.round(newY * 10) / 10,
      });
    }
  };

  const handleLayerPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    // Commit drawn box
    if (isDrawMode && drawingStart && drawingCurrent) {
      const x = Math.min(drawingStart.x, drawingCurrent.x);
      const y = Math.min(drawingStart.y, drawingCurrent.y);
      const width = Math.abs(drawingCurrent.x - drawingStart.x);
      const height = Math.abs(drawingCurrent.y - drawingStart.y);

      // Require minimum size 4% by 4% to prevent accidental taps
      if (width >= 4 && height >= 4) {
        const customCount = boxes.filter(b => b.isUserDrawn).length + 1;
        const newBox: ForensicBoundingBox = {
          id: `box-user-${Date.now()}`,
          label: `วัตถุที่กำหนดเพิ่ม #${customCount}`,
          category: 'วัตถุพยานตรวจพิสูจน์ (Custom Forensic Item)',
          confidence: 0.95,
          x: Math.round(x * 10) / 10,
          y: Math.round(y * 10) / 10,
          width: Math.round(width * 10) / 10,
          height: Math.round(height * 10) / 10,
          color: '#06b6d4',
          traceDetails: 'พื้นที่วัตถุพยานที่ผู้สืบสวนกำหนดขึ้นเพื่อส่งตรวจทางนิติเวช มีความผิดปกติทางกายภาพหรือคราบต้องสงสัย',
          suspiciousCue: 'พิกัดพื้นที่ต้องสงสัยที่ระบุด้วยตนเอง',
          isUserDrawn: true,
          isRelatedToIncident: true,
          causeOfDeathHypothesis: 'พบร่องรอยและคราบต้องสงสัยที่อาจเชื่อมโยงกับการเสียชีวิต อยู่ระหว่างรอผลตรวจสารเคมีระดับไมโคร',
        };
        onCreateBox(newBox);
        onInspectDeep(newBox);
      }

      setDrawingStart(null);
      setDrawingCurrent(null);
    }

    // Release drag box
    if (draggingBoxId) {
      setDraggingBoxId(null);
    }
  };

  // Start dragging a specific box marker
  const handleBoxPointerDown = (box: ForensicBoundingBox, e: React.PointerEvent) => {
    if (isDrawMode) return; // let draw mode take precedence
    e.stopPropagation();

    if (isMoveMode) {
      const coords = getContainerPercent(e.clientX, e.clientY);
      setDraggingBoxId(box.id);
      setDragOffset({
        x: coords.x - (box.x + box.width / 2),
        y: coords.y - (box.y + box.height / 2),
      });
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }
  };

  if (!isVisible) return null;

  // Calculate live preview rectangle while drawing
  const liveRect = isDrawMode && drawingStart && drawingCurrent ? {
    x: Math.min(drawingStart.x, drawingCurrent.x),
    y: Math.min(drawingStart.y, drawingCurrent.y),
    width: Math.abs(drawingCurrent.x - drawingStart.x),
    height: Math.abs(drawingCurrent.y - drawingStart.y),
  } : null;

  return (
    <div
      className={`absolute inset-0 z-25 select-none ${
        isDrawMode ? 'cursor-crosshair' : isMoveMode ? 'cursor-move' : 'cursor-default'
      }`}
      style={{ touchAction: isDrawMode || isMoveMode ? 'none' : 'auto' }}
      onPointerDown={handleLayerPointerDown}
      onPointerMove={handleLayerPointerMove}
      onPointerUp={handleLayerPointerUp}
      onPointerCancel={handleLayerPointerUp}
    >
      {/* 1. Render Clean 'ตรวจสอบ' (Inspect) Markers for All Objects That Might Be Relevant - NO COLORED FRAMES */}
      {boxes
        .filter((box) => !box.clueId) // boxes with clueId are already rendered by the main clue marker loop
        .map((box) => {
          const isDragging = draggingBoxId === box.id;
          const centerX = box.x + box.width / 2;
          const centerY = box.y + box.height / 2;

          return (
            <div
              key={box.id}
              id={`ambient-inspect-${box.id}`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-auto select-none ${
                isMoveMode ? 'cursor-move' : 'cursor-pointer'
              } ${isDragging ? 'scale-125 z-50 transition-none' : 'transition-transform hover:scale-110 active:scale-95'}`}
              style={{
                left: `${centerX}%`,
                top: `${centerY}%`,
                touchAction: 'none',
              }}
              onPointerDown={(e) => handleBoxPointerDown(box, e)}
              onClick={(e) => {
                e.stopPropagation();
                if (isMoveMode) return;
                onInspectDeep(box);
              }}
              title={`แตะเพื่อตรวจสอบ: ${box.label}`}
            >
              {/* Tactical Forensic 'ตรวจสอบ' Marker - Absolutely No Colored Box Frames */}
              <div className="relative group/ambient flex items-center justify-center">
                {/* Click Target Hitbox */}
                <div className="w-14 h-14 -m-7 rounded-full flex items-center justify-center relative">
                  {/* Subtle Ambient Pulse Ring */}
                  <div className="absolute inset-2 rounded-full border border-amber-400/40 bg-amber-500/10 backdrop-blur-[1px] animate-pulse group-hover/ambient:bg-amber-400/25 group-hover/ambient:border-amber-300 transition-all duration-200" />

                  {/* Center Optical Dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />

                  {/* Clean Magnifying Pill Button 'ตรวจสอบ' */}
                  <div className="absolute -bottom-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/85 border border-amber-400/70 text-[9px] font-mono text-amber-300 shadow-lg group-hover/ambient:scale-110 transition-transform">
                    <Search className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                    <span className="font-semibold whitespace-nowrap">ตรวจสอบ</span>
                  </div>

                  {/* Move Handle Icon if in Move Mode */}
                  {isMoveMode && (
                    <div className="absolute -top-1 -right-1 p-0.5 rounded-full bg-purple-600 text-white shadow">
                      <Move className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {/* Hover Tooltip showing item name */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/ambient:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  <div className="bg-black/95 text-amber-200 border border-amber-500/60 px-2 py-0.5 rounded-md text-[10px] font-mono shadow-xl flex items-center gap-1">
                    <span>{box.label}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {/* 2. Live Drawing Box Preview (Only visible while actively dragging in Draw Mode) */}
      {liveRect && (
        <div
          className="absolute border-2 border-amber-400 border-dashed bg-amber-500/20 pointer-events-none z-40 animate-pulse"
          style={{
            left: `${liveRect.x}%`,
            top: `${liveRect.y}%`,
            width: `${liveRect.width}%`,
            height: `${liveRect.height}%`,
          }}
        >
          <div className="absolute -top-6 left-0 bg-amber-400 text-black font-mono font-bold text-[9px] px-2 py-0.5 rounded shadow">
            📐 กำลังตีกรอบ... ({Math.round(liveRect.width)}% × {Math.round(liveRect.height)}%)
          </div>
        </div>
      )}

      {/* 3. Detail Inspection Card / Drawer for Selected Bounding Box ("ให้ดูรายละเอียดได้") */}
      {selectedBox && (
        <div
          id="bbox-detail-drawer"
          className="fixed sm:absolute bottom-3 left-3 right-3 sm:right-auto sm:w-96 z-50 bg-[#090e1c]/95 backdrop-blur-md border-2 border-cyan-400 rounded-xl p-3.5 shadow-[0_0_30px_rgba(0,0,0,0.9)] animate-fadeIn text-slate-100 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-cyan-500/30 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                <Microscope className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  {selectedBox.category}
                </span>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {selectedBox.label}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {selectedBox.isUserDrawn && onDeleteBox && (
                <button
                  type="button"
                  onClick={() => onDeleteBox(selectedBox.id)}
                  className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-950/50 cursor-pointer"
                  title="ลบกรอบวัตถุนี้"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onSelectBox(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
                title="ปิดหน้าต่างรายละเอียด"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-2 text-xs">
            {/* Incident Relation Status Banner */}
            {selectedBox.isRelatedToIncident === false ? (
              <div className="p-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 text-xs space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold border border-slate-700">
                    ❌ ของนี้ไม่เกี่ยวกับเหตุการณ์
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedBox.unrelatedExplanation || 'ผลการตรวจพิสูจน์ไม่พบสารพิษ คราบเลือด หรือร่องรอยการต่อสู้ เป็นวัตถุตามปกติในสถานที่เกิดเหตุ และไม่ได้เชื่อมโยงกับสาเหตุการเสียชีวิต'}
                </p>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-mono text-[10px] font-black">
                    🔍 วัตถุพยานสำคัญในคดี
                  </span>
                  <span className="text-cyan-300 text-[11px]">เชื่อมโยงสาเหตุการเสียชีวิต:</span>
                </div>
                {selectedBox.causeOfDeathHypothesis && (
                  <div className="p-2 rounded-lg bg-black/60 border border-cyan-500/30 text-slate-100">
                    <span className="font-bold text-amber-300 text-[11px] block mb-0.5">
                      ⚡ คาดว่าน่าจะเสียชีวิตเพราะ:
                    </span>
                    <p className="text-[11px] text-amber-100/95 leading-relaxed font-medium">
                      {selectedBox.causeOfDeathHypothesis}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Visual anomaly / clue cue */}
            {selectedBox.suspiciousCue && (
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-cyan-300">จุดสังเกตในกรอบ: </span>
                  <span>{selectedBox.suspiciousCue}</span>
                </div>
              </div>
            )}

            {/* Forensic Trace Details */}
            <div className="text-[11px] text-slate-300 leading-relaxed">
              <span className="font-bold text-cyan-300 font-mono flex items-center gap-1 mb-0.5">
                <Tag className="w-3 h-3 text-cyan-400" />
                ผลการตรวจพิสูจน์วัตถุพยาน:
              </span>
              <p className="bg-black/50 p-2 rounded-lg border border-slate-800 font-mono text-[10.5px]">
                {selectedBox.traceDetails}
              </p>
            </div>

            {/* Confidence Gauge */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span>ความเชื่อมั่นผลตรวจ (AI Confidence):</span>
              <span className="font-bold text-emerald-400">
                {Math.round(selectedBox.confidence * 100)}% Match
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-2.5 mt-2.5 border-t border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono">
              พิกัด: X {Math.round(selectedBox.x)}% | Y {Math.round(selectedBox.y)}%
            </span>

            <button
              type="button"
              onClick={() => onInspectDeep(selectedBox)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-black text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Microscope className="w-3.5 h-3.5 text-black" />
              <span>ตรวจสอบละเอียด</span>
              <ArrowRight className="w-3 h-3 text-black" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera, ZoomIn, ZoomOut, Search, User, ShieldAlert, Radio, Sparkles, X, Microscope, Eye,
  Upload, Image as ImageIcon, Move, Square, RefreshCw, Zap, Tag, Check, Layers
} from 'lucide-react';
import { CaseStage, Clue, ForensicBoundingBox } from '../types';
import { SuspiciousBlemishMarker } from './SuspiciousBlemishMarker';
import { ClueCalloutCard } from './ClueCalloutCard';
import { ForensicBoundingBoxLayer } from './ForensicBoundingBoxLayer';
import { CASE_DEFAULT_BOUNDING_BOXES, generateUploadedImageDetections } from '../data/caseBoundingBoxes';

interface CrimeSceneViewerProps {
  caseData: CaseStage;
  collectedClues: Set<string>;
  onSelectClue: (clueIndex: number) => void;
  onOpenClueModal?: (clue: Clue) => void;
  onOpenVictimFile: () => void;
  tutorialTarget?: { x: number; y: number; label: string } | null;
  isVictimButtonHighlighted?: boolean;
  onOpenStageManager?: () => void;
}

export const CrimeSceneViewer: React.FC<CrimeSceneViewerProps> = ({
  caseData,
  collectedClues,
  onSelectClue,
  onOpenClueModal,
  onOpenVictimFile,
  tutorialTarget,
  isVictimButtonHighlighted,
  onOpenStageManager,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [focusedClue, setFocusedClue] = useState<Clue | null>(null);
  const [activeCalloutId, setActiveCalloutId] = useState<string | null>(null);
  const [isRadarPinging, setIsRadarPinging] = useState<boolean>(false);
  const [feedbackRipple, setFeedbackRipple] = useState<{ x: number; y: number; text: string } | null>(null);

  // Custom Uploaded Image State
  const [customSceneImage, setCustomSceneImage] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  // Forensic Bounding Box & AI Detection States
  const [boundingBoxes, setBoundingBoxes] = useState<ForensicBoundingBox[]>([]);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [isDrawMode, setIsDrawMode] = useState<boolean>(false);
  const [isMoveMode, setIsMoveMode] = useState<boolean>(false);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [isScanningAi, setIsScanningAi] = useState<boolean>(false);

  // Draggable Clue Positions
  const [cluePositions, setCluePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingClueId, setDraggingClueId] = useState<string | null>(null);
  const clueDragStartRef = useRef<{ clientX: number; clientY: number; moved: boolean }>({
    clientX: 0,
    clientY: 0,
    moved: false,
  });

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isClueCollected = (clueId: string) => collectedClues.has(clueId);

  // Sync positions & default boxes when case changes
  useEffect(() => {
    const initialPos: Record<string, { x: number; y: number }> = {};
    caseData.clues.forEach((clue) => {
      initialPos[clue.id] = { x: clue.position.x, y: clue.position.y };
    });
    setCluePositions(initialPos);
    setCustomSceneImage(null);
    setBoundingBoxes(CASE_DEFAULT_BOUNDING_BOXES[caseData.id] || []);
    setSelectedBoxId(null);
    setIsDrawMode(false);
    setIsMoveMode(false);
    setZoomLevel(1);
    setFocusedClue(null);
    setActiveCalloutId(null);
  }, [caseData.id]);

  // Zoom directly into a specific clue when explicitly commanded
  const handleZoomIntoClue = (clue: Clue, index?: number) => {
    setFocusedClue(clue);
    setZoomLevel(2.3);
    setActiveCalloutId(clue.id);
    if (index !== undefined) {
      onSelectClue(index);
    }
  };

  // Reset zoom back to full crime scene overview (1x)
  const handleResetZoom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomLevel(1);
    setFocusedClue(null);
  };

  const toggleZoom = () => {
    if (zoomLevel > 1) {
      handleResetZoom();
    } else {
      if (activeCalloutId) {
        const found = caseData.clues.find((c) => c.id === activeCalloutId);
        if (found) {
          handleZoomIntoClue(found);
          return;
        }
      }
      setZoomLevel(1.8);
    }
  };

  const handleTriggerRadar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRadarPinging) return;
    setIsRadarPinging(true);
    setTimeout(() => {
      setIsRadarPinging(false);
    }, 2000);
  };

  // Trigger Smart AI Object & Trace Scan
  const handleTriggerAiScan = () => {
    if (isScanningAi) return;
    setIsScanningAi(true);
    setShowBoundingBoxes(true);
    setTimeout(() => {
      setIsScanningAi(false);
      // If custom image has no boxes, generate detections
      if (customSceneImage && boundingBoxes.length === 0) {
        setBoundingBoxes(generateUploadedImageDetections());
      } else if (!customSceneImage && boundingBoxes.length === 0) {
        setBoundingBoxes(CASE_DEFAULT_BOUNDING_BOXES[caseData.id] || []);
      }
    }, 1600);
  };

  // File Upload Handlers (Click and Drag-and-Drop)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomSceneImage(result);
        setBoundingBoxes(generateUploadedImageDetections());
        setShowBoundingBoxes(true);
        handleTriggerAiScan();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomSceneImage(result);
          setBoundingBoxes(generateUploadedImageDetections());
          setShowBoundingBoxes(true);
          handleTriggerAiScan();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset custom image back to original case image
  const handleResetToDefaultCaseImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomSceneImage(null);
    setBoundingBoxes(CASE_DEFAULT_BOUNDING_BOXES[caseData.id] || []);
  };

  // Bounding Box Operations
  const handleUpdateBox = (updated: ForensicBoundingBox) => {
    setBoundingBoxes((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleCreateBox = (newBox: ForensicBoundingBox) => {
    setBoundingBoxes((prev) => [...prev, newBox]);
    setShowBoundingBoxes(true);
  };

  const handleDeleteBox = (boxId: string) => {
    setBoundingBoxes((prev) => prev.filter((b) => b.id !== boxId));
    if (selectedBoxId === boxId) {
      setSelectedBoxId(null);
    }
  };

  // Deep inspect a bounding box ("ให้ดูรายละเอียดได้")
  const handleInspectDeepBox = (box: ForensicBoundingBox) => {
    if (box.clueId) {
      const matched = caseData.clues.find((c) => c.id === box.clueId);
      if (matched && onOpenClueModal) {
        onOpenClueModal({
          ...matched,
          isRelatedToIncident: box.isRelatedToIncident,
          causeOfDeathHypothesis: box.causeOfDeathHypothesis || matched.causeOfDeathHypothesis,
          unrelatedExplanation: box.unrelatedExplanation,
        });
        return;
      }
    }

    // Build synthetic clue for custom box, ambient objects or uploaded image box
    const customClue: Clue = {
      id: box.id,
      name: box.label,
      short: box.label.slice(0, 16),
      icon: box.isRelatedToIncident === false ? 'Package' : 'Microscope',
      desc: box.isRelatedToIncident === false 
        ? (box.unrelatedExplanation || 'ของนี้ไม่เกี่ยวกับเหตุการณ์: ไม่พบสารพิษ คราบเลือด หรือร่องรอยการต่อสู้')
        : box.traceDetails,
      details: box.traceDetails,
      forensicCategory: box.category,
      position: { x: box.x, y: box.y },
      suspiciousVisualCue: box.suspiciousCue || box.label,
      evidenceImage: customSceneImage || caseData.sceneImage,
      isRelatedToIncident: box.isRelatedToIncident,
      causeOfDeathHypothesis: box.causeOfDeathHypothesis,
      unrelatedExplanation: box.unrelatedExplanation,
      closeUpAnalysis: box.isRelatedToIncident === false
        ? (box.unrelatedExplanation || 'ผลการสแกนความละเอียดสูง ยืนยันว่าวัตถุนี้ไม่มีสิ่งปนเปื้อนและไม่มีความเชื่อมโยงกับสาเหตุการเสียชีวิต')
        : (box.causeOfDeathHypothesis ? `ข้อสันนิษฐานนิติเวช: ${box.causeOfDeathHypothesis}` : undefined),
      forensicTraces: [
        {
          id: `trace-${box.id}-1`,
          name: box.label,
          type: box.isRelatedToIncident === false ? 'other' : 'chemical',
          description: box.isRelatedToIncident === false 
            ? (box.unrelatedExplanation || 'วัตถุปกติ ไม่เกี่ยวข้องกับคดี')
            : (box.causeOfDeathHypothesis || box.traceDetails),
          locationLabel: 'พิกัดวัตถุในกรอบ',
          pinX: 50,
          pinY: 50,
        },
      ],
    };

    if (onOpenClueModal) {
      onOpenClueModal(customClue);
    }
  };

  // Draggable Clue Handlers (Pointer Event with Touch Support)
  const handleCluePointerDown = (clueId: string, e: React.PointerEvent) => {
    if (isDrawMode) return;
    e.stopPropagation();
    clueDragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      moved: false,
    };
    setDraggingClueId(clueId);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handleCluePointerMove = (clueId: string, e: React.PointerEvent) => {
    if (draggingClueId !== clueId || !imageContainerRef.current) return;
    const dx = Math.abs(e.clientX - clueDragStartRef.current.clientX);
    const dy = Math.abs(e.clientY - clueDragStartRef.current.clientY);
    if (dx > 4 || dy > 4) {
      clueDragStartRef.current.moved = true;
    }

    if (clueDragStartRef.current.moved) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const newX = Math.max(4, Math.min(96, ((e.clientX - rect.left) / rect.width) * 100));
      const newY = Math.max(6, Math.min(94, ((e.clientY - rect.top) / rect.height) * 100));
      setCluePositions((prev) => ({
        ...prev,
        [clueId]: { x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 },
      }));
    }
  };

  const handleCluePointerUp = (clue: Clue, index: number, e: React.PointerEvent) => {
    e.stopPropagation();
    const wasMoved = clueDragStartRef.current.moved;
    setDraggingClueId(null);
    clueDragStartRef.current.moved = false;

    // If not moved (a normal click/tap), select clue & open callout card
    if (!wasMoved) {
      setActiveCalloutId(clue.id);
      onSelectClue(index);
    }
  };

  // Direct Scene Click: When player taps anywhere on the photo to investigate
  const handleSceneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDrawMode || isMoveMode) return;
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // 1. Check if click is near any uncollected clue (within 10% radius)
    const hitClueIndex = caseData.clues.findIndex((clue) => {
      const pos = cluePositions[clue.id] || clue.position;
      const dx = Math.abs(pos.x - clickX);
      const dy = Math.abs(pos.y - clickY);
      return Math.sqrt(dx * dx + dy * dy) <= 10;
    });

    if (hitClueIndex !== -1) {
      const hitClue = caseData.clues[hitClueIndex];
      setActiveCalloutId(hitClue.id);
      onSelectClue(hitClueIndex);
      return;
    }

    // 2. Check if click is near victim position
    const victimPos = caseData.victim.position || { x: 50, y: 60 };
    const vdx = Math.abs(victimPos.x - clickX);
    const vdy = Math.abs(victimPos.y - clickY);
    if (Math.sqrt(vdx * vdx + vdy * vdy) <= 12) {
      onOpenVictimFile();
      return;
    }

    // 3. Tactile feedback ripple if clicked empty area
    setFocusedClue(null);
    setFeedbackRipple({
      x: clickX,
      y: clickY,
      text: 'ไม่พบวัตถุพยานในบริเวณนี้',
    });

    setTimeout(() => {
      setFeedbackRipple((prev) => (prev?.x === clickX && prev?.y === clickY ? null : prev));
    }, 1100);
  };

  const isMale = caseData.victim.gender === 'ชาย';
  const collectedCount = caseData.clues.filter((c) => collectedClues.has(c.id)).length;
  const totalClues = caseData.clues.length;

  const currentDisplayImage = customSceneImage || caseData.sceneImage;

  // Transform origin calculation: centers on the focused clue if zoomed
  const transformOrigin = focusedClue
    ? `${(cluePositions[focusedClue.id] || focusedClue.position).x}% ${(cluePositions[focusedClue.id] || focusedClue.position).y}%`
    : '50% 50%';

  return (
    <section className="relative rounded-2xl overflow-hidden border border-[#23304d] bg-[#070b14] shadow-2xl select-none group">
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* TOP BAR 1: Camera Location & Clue Counter */}
      <div className="absolute top-2.5 left-2.5 z-30 flex flex-wrap items-center gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] sm:text-xs text-cyan-300 font-mono tracking-wider shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate max-w-[120px] sm:max-w-[180px]">{caseData.cameraText}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping ml-0.5 shrink-0" />
        </div>

        {/* Found Clues Counter Badge */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] sm:text-xs font-mono backdrop-blur-md bg-slate-950/85 border-amber-500/60 text-amber-300 shadow-lg pointer-events-auto">
          <Search className="w-3 h-3 text-amber-400" />
          <span>หลักฐาน: {collectedCount}/{totalClues}</span>
        </div>

        {/* Custom Upload Active Badge */}
        {customSceneImage && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-mono backdrop-blur-md bg-purple-950/90 border-purple-400 text-purple-200 shadow-lg pointer-events-auto animate-pulse">
            <ImageIcon className="w-3 h-3 text-purple-300" />
            <span className="hidden sm:inline">ภาพที่อัปโหลดเอง</span>
            <button
              onClick={handleResetToDefaultCaseImage}
              className="ml-1 text-slate-300 hover:text-white underline cursor-pointer"
              title="กลับสู่ภาพคดีจำลองเดิม"
            >
              ↺ คดีเดิม
            </button>
          </div>
        )}
      </div>

      {/* TOP BAR 2: ADVANCED FORENSIC TOOLBAR (Upload, Detect, Draw, Move, Zoom) */}
      <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-[calc(100%-10px)] pb-1 pointer-events-auto">
        {/* Upload & Stage Studio Button ("ช่วยทำให้เเก้ไขเเละเพิ่มด่านใหม่ได้หน่อย ให้อยู่ในส่วนเดียวกับตอนอัพโหลดอะ") */}
        <button
          onClick={() => {
            if (onOpenStageManager) {
              onOpenStageManager();
            } else {
              fileInputRef.current?.click();
            }
          }}
          className="px-2.5 py-1 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 text-cyan-300 border border-cyan-400/80 hover:border-cyan-300 text-[10px] sm:text-xs font-mono flex items-center gap-1 backdrop-blur-md transition-all shadow-md cursor-pointer shrink-0 font-bold"
          title="อัปโหลดภาพที่เกิดเหตุ เพิ่มด่านใหม่ หรือแก้ไขด่าน"
        >
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span>อัปโหลด & เพิ่ม/แก้ไขด่าน</span>
        </button>

        {/* AI Smart Detect Button ("ให้มันดีเทคได้ด้วยว่ารายละเอียดต่างๆยังไง") */}
        <button
          onClick={handleTriggerAiScan}
          disabled={isScanningAi}
          className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono flex items-center gap-1 backdrop-blur-md transition-all shadow-md cursor-pointer shrink-0 ${
            isScanningAi
              ? 'bg-cyan-500 text-black font-bold animate-pulse scale-105'
              : 'bg-black/90 text-cyan-300 hover:text-cyan-100 border border-cyan-500/60 hover:border-cyan-300'
          }`}
          title="สแกนและตรวจจับวัตถุพยานอัตโนมัติพร้อมตีกรอบและระบุรายละเอียด"
        >
          <Zap className={`w-3 h-3 ${isScanningAi ? 'text-black animate-spin' : 'text-cyan-400'}`} />
          <span>{isScanningAi ? 'กำลังสแกน...' : 'ตรวจจับ AI'}</span>
        </button>

        {/* Draw Box Mode Toggle ("เอาให้ตีกรอบได้") */}
        <button
          onClick={() => {
            setIsDrawMode(!isDrawMode);
            if (!isDrawMode) {
              setIsMoveMode(false);
              setShowBoundingBoxes(true);
            }
          }}
          className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono flex items-center gap-1 backdrop-blur-md transition-all shadow-md cursor-pointer shrink-0 ${
            isDrawMode
              ? 'bg-amber-400 text-black font-bold shadow-[0_0_12px_rgba(251,191,36,0.6)] scale-105'
              : 'bg-black/90 text-amber-300 hover:text-amber-100 border border-amber-500/50'
          }`}
          title="เปิดโหมดลากนิ้ว/เมาส์เพื่อตีกรอบวัตถุพยานด้วยตนเอง"
        >
          <Square className="w-3 h-3" />
          <span>{isDrawMode ? '✓ กำลังตีกรอบ' : 'ตีกรอบ'}</span>
        </button>

        {/* Move Objects & Markers Toggle ("สิ่งของจับขยับได้") */}
        <button
          onClick={() => {
            setIsMoveMode(!isMoveMode);
            if (!isMoveMode) {
              setIsDrawMode(false);
            }
          }}
          className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono flex items-center gap-1 backdrop-blur-md transition-all shadow-md cursor-pointer shrink-0 ${
            isMoveMode
              ? 'bg-purple-500 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.7)] scale-105'
              : 'bg-black/90 text-purple-300 hover:text-purple-100 border border-purple-500/50'
          }`}
          title="เปิดโหมดจับขยับตำแหน่งหมุดและกรอบวัตถุพยาน"
        >
          <Move className="w-3 h-3" />
          <span>{isMoveMode ? '✓ ขยับหมุด' : 'ขยับของ'}</span>
        </button>

        {/* Toggle Inspection Markers Visibility */}
        {boundingBoxes.length > 0 && (
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1 border backdrop-blur-md transition-all cursor-pointer shrink-0 ${
              showBoundingBoxes
                ? 'bg-slate-800 text-amber-300 border-amber-500/40'
                : 'bg-black/70 text-slate-400 border-slate-700 opacity-60'
            }`}
            title="ซ่อน/แสดงจุดตรวจวัตถุแวดล้อม"
          >
            <Layers className="w-3 h-3" />
            <span className="hidden md:inline">{showBoundingBoxes ? 'ซ่อนจุดตรวจทั่วไป' : 'โชว์ทุกจุดตรวจ'}</span>
          </button>
        )}

        {/* Radar Ping */}
        <button
          onClick={handleTriggerRadar}
          className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono flex items-center gap-1 border backdrop-blur-md transition-all shadow-md cursor-pointer shrink-0 ${
            isRadarPinging
              ? 'bg-amber-500 text-black border-amber-300 font-bold scale-105'
              : 'bg-black/90 text-amber-400 border-amber-500/60 hover:bg-amber-950/80'
          }`}
          title="สแกนคลื่นนิติเวชค้นหาจุดต้องสงสัยชั่วคราว"
        >
          <Radio className={`w-3 h-3 ${isRadarPinging ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">เรดาร์</span>
        </button>

        {/* Manual Zoom Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleZoom();
          }}
          className="px-2 py-1 rounded-lg bg-black/90 text-slate-300 hover:text-white border border-slate-700 text-[10px] sm:text-xs font-mono flex items-center gap-1 backdrop-blur-md shadow-md transition-colors cursor-pointer shrink-0"
          title="ซูมขยายภาพสถานที่เกิดเหตุ"
        >
          {zoomLevel > 1 ? <ZoomOut className="w-3 h-3 text-cyan-400" /> : <ZoomIn className="w-3 h-3 text-cyan-400" />}
          <span>{zoomLevel.toFixed(1)}x</span>
        </button>
      </div>

      {/* Interactive Mode Banner (Draw Mode or Move Mode Active) */}
      {(isDrawMode || isMoveMode) && (
        <div className="absolute top-12 left-3 right-3 sm:right-auto z-30 max-w-md bg-black/95 backdrop-blur-md border-2 border-amber-400 rounded-xl p-2 shadow-2xl flex items-center justify-between gap-2 animate-fadeIn pointer-events-auto">
          <div className="flex items-center gap-2 text-xs font-mono">
            {isDrawMode ? (
              <>
                <Square className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                <span className="text-amber-300 font-bold">
                  โหมดตีกรอบ: ลากนิ้วหรือเมาส์บนภาพเพื่อตีกรอบวัตถุพยาน
                </span>
              </>
            ) : (
              <>
                <Move className="w-4 h-4 text-purple-400 animate-pulse shrink-0" />
                <span className="text-purple-300 font-bold">
                  โหมดขยับ: แตะลากหมุด CSI หรือกรอบวัตถุเพื่อเปลี่ยนตำแหน่ง
                </span>
              </>
            )}
          </div>
          <button
            onClick={() => {
              setIsDrawMode(false);
              setIsMoveMode(false);
            }}
            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px] font-mono border border-slate-600 cursor-pointer"
          >
            เสร็จสิ้น
          </button>
        </div>
      )}

      {/* Zoom Mode Banner Indicator */}
      {zoomLevel > 1 && focusedClue && !isDrawMode && !isMoveMode && (
        <div className="absolute top-12 left-3 right-3 sm:right-auto z-30 max-w-md bg-[#0a101f]/95 backdrop-blur-md border-2 border-amber-400/80 rounded-xl p-2.5 shadow-[0_0_25px_rgba(251,191,36,0.3)] animate-fadeIn pointer-events-auto">
          <div className="flex items-center justify-between gap-2 border-b border-amber-500/30 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs font-mono">
              <Eye className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>โหมดซูมตรวจร่องรอย: {focusedClue.name}</span>
            </div>
            <button
              onClick={handleResetZoom}
              className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800 cursor-pointer"
              title="ปิดโหมดซูม"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-[11px] text-amber-100/90 leading-tight mb-2">
            <span className="font-bold text-amber-300">🔎 ร่องรอยที่สังเกตเห็น: </span>
            {focusedClue.suspiciousVisualCue || focusedClue.blemish?.label}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onOpenClueModal) {
                  onOpenClueModal(focusedClue);
                }
              }}
              className="px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] font-mono flex items-center gap-1 shadow-sm transition-transform hover:scale-105 cursor-pointer"
            >
              <Microscope className="w-3 h-3" />
              <span>ส่องกล้องขยายภาพความละเอียดสูง (Macro Lab)</span>
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono cursor-pointer"
            >
              มุมมองห้องรวม
            </button>
          </div>
        </div>
      )}

      {/* Main Photographic Scene Canvas */}
      <div
        ref={imageContainerRef}
        onClick={handleSceneClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full relative aspect-[4/3] max-h-[500px] overflow-hidden flex items-center justify-center bg-black select-none ${
          isDrawMode ? 'cursor-crosshair' : isMoveMode ? 'cursor-move' : 'cursor-crosshair'
        }`}
      >
        {/* Drag & Drop Overlay Indicator */}
        {isDraggingOver && (
          <div className="absolute inset-0 z-50 bg-cyan-950/80 border-4 border-dashed border-cyan-400 flex flex-col items-center justify-center text-cyan-200 pointer-events-none animate-pulse">
            <Upload className="w-12 h-12 mb-2 text-cyan-400 animate-bounce" />
            <h3 className="text-lg font-bold">วางไฟล์รูปภาพที่นี่เพื่ออัปโหลด</h3>
            <p className="text-xs text-cyan-300 font-mono">ระบบจะสแกนตรวจจับวัตถุพยานอัตโนมัติ</p>
          </div>
        )}

        {/* AI Laser Scanner Beam Animation */}
        {isScanningAi && (
          <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_30px_rgba(6,182,212,1)] animate-bounce" />
            <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-black/90 border-2 border-cyan-400 text-cyan-300 font-mono text-xs font-bold shadow-[0_0_30px_rgba(6,182,212,0.8)] flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>CSI AI SMART DETECTION SCANNING...</span>
            </div>
          </div>
        )}

        {/* Realistic Photograph with Dynamic Zoom & Transform Origin */}
        <div
          className="w-full h-full relative transition-transform duration-500 ease-out"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: transformOrigin,
          }}
        >
          <img
            src={currentDisplayImage}
            alt={caseData.title}
            className="w-full h-full object-cover select-none filter brightness-[0.98] contrast-105 pointer-events-none"
            decoding="async"
          />

          {/* Natural Film Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />

          {/* Forensic Scale Marker in corner */}
          <div className="absolute bottom-10 left-3 pointer-events-none flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-700/60 text-[9px] font-mono text-slate-300">
            <span className="w-8 h-1 bg-white inline-block border-r border-l border-black" />
            <span>50 cm</span>
          </div>

          {/* FORENSIC BOUNDING BOXES LAYER ("เอาให้ตีกรอบได้ / ดีเทคได้ว่ารายละเอียดต่างๆยังไง") */}
          <ForensicBoundingBoxLayer
            boxes={boundingBoxes}
            selectedBoxId={selectedBoxId}
            isDrawMode={isDrawMode}
            isMoveMode={isMoveMode}
            isVisible={showBoundingBoxes}
            onSelectBox={(box) => setSelectedBoxId(box ? box.id : null)}
            onUpdateBox={handleUpdateBox}
            onCreateBox={handleCreateBox}
            onDeleteBox={handleDeleteBox}
            onInspectDeep={handleInspectDeepBox}
            containerRef={imageContainerRef}
          />

          {/* Invisible Interactive Hitbox for Victim (If using default case image) */}
          {!customSceneImage && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer pointer-events-auto w-24 h-24 rounded-full"
              style={{
                left: `${caseData.victim.position?.x ?? 50}%`,
                top: `${caseData.victim.position?.y ?? 60}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onOpenVictimFile();
              }}
              title="คลิกสำรวจสภาพศพและเสื้อผ้าของผู้เสียชีวิต"
            />
          )}

          {/* Forensic Evidence Elements (Draggable Objects & Pins - "สิ่งของจับขยับได้") */}
          <div className="absolute inset-0 pointer-events-auto">
            {caseData.clues.map((clue, idx) => {
              const collected = isClueCollected(clue.id);
              const isSelected = activeCalloutId === clue.id;
              const isFocused = focusedClue?.id === clue.id && zoomLevel > 1;
              const pos = cluePositions[clue.id] || clue.position;
              const isDraggingThis = draggingClueId === clue.id;

              return (
                <div
                  key={clue.id}
                  id={`clue-marker-${clue.id}`}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-30 ${
                    isMoveMode ? 'cursor-move' : 'cursor-pointer'
                  } ${isDraggingThis ? 'scale-125 z-50 transition-none' : 'transition-transform'}`}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    touchAction: 'none',
                  }}
                  onPointerDown={(e) => handleCluePointerDown(clue.id, e)}
                  onPointerMove={(e) => handleCluePointerMove(clue.id, e)}
                  onPointerUp={(e) => handleCluePointerUp(clue, idx, e)}
                  onPointerCancel={(e) => handleCluePointerUp(clue, idx, e)}
                >
                  {/* Clean Forensic Marker with Drag Indicator if in Move Mode */}
                  <div className="relative">
                    <SuspiciousBlemishMarker
                      clue={clue}
                      index={idx}
                      isCollected={collected}
                      isSelected={isSelected}
                      isRadarPinging={isRadarPinging}
                    />
                    {isMoveMode && (
                      <div className="absolute -bottom-2 -right-2 p-0.5 rounded-full bg-purple-600 text-white shadow">
                        <Move className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {/* High-Tech Forensic Laser & Trace Overlay when zoomed in onto this clue */}
                  {isFocused && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 flex items-center justify-center">
                      <div className="w-20 h-20 border-2 border-dashed border-amber-400 rounded-full animate-spin [animation-duration:12s]" />
                      <div className="absolute w-24 h-24 border border-cyan-400/80 rounded-xl" />
                      <div className="absolute w-28 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                      <div className="absolute h-28 w-[1px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />

                      <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-black/95 text-amber-300 border-2 border-amber-400 px-2.5 py-1 rounded-lg text-[9px] font-mono whitespace-nowrap shadow-[0_0_20px_rgba(251,191,36,0.8)] pointer-events-auto flex items-center gap-1.5 animate-bounce">
                        <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="font-bold text-white">
                          ร่องรอย: {clue.suspiciousVisualCue || clue.blemish?.label || clue.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* CSI Callout Card upon Discovery */}
                  {isSelected && !isFocused && (
                    <ClueCalloutCard
                      clue={clue}
                      index={idx}
                      isCollected={collected}
                      onOpenFullModal={(selectedClue) => {
                        if (onOpenClueModal) {
                          onOpenClueModal(selectedClue);
                        } else {
                          onSelectClue(idx);
                        }
                      }}
                      onZoomScene={() => handleZoomIntoClue(clue, idx)}
                      onClose={() => setActiveCalloutId(null)}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Tutorial Interactive Beacon Marker */}
          {tutorialTarget && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none z-40 flex flex-col items-center animate-bounce"
              style={{
                left: `${tutorialTarget.x}%`,
                top: `${tutorialTarget.y - 1}%`,
              }}
            >
              <div className="bg-gradient-to-r from-amber-400 to-amber-300 text-black font-mono font-bold text-xs px-3 py-1.5 rounded-full shadow-[0_0_25px_rgba(251,191,36,0.95)] border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span>{tutorialTarget.label}</span>
              </div>
              <div className="w-3.5 h-3.5 bg-amber-300 rotate-45 -mt-1.5 border-r border-b border-white" />
              <div className="w-14 h-14 rounded-full border-2 border-amber-400 animate-ping -mt-3.5" />
            </div>
          )}

          {/* Tactile Feedback Ripple when clicking empty area */}
          {feedbackRipple && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-35 flex flex-col items-center animate-fadeIn"
              style={{
                left: `${feedbackRipple.x}%`,
                top: `${feedbackRipple.y}%`,
              }}
            >
              <div className="w-8 h-8 rounded-full border border-white/60 animate-ping" />
              <div className="mt-1 bg-black/90 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-700 shadow-xl whitespace-nowrap">
                {feedbackRipple.text}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Scene Information & Inspection Guide */}
      <div className="p-3 bg-[#0d1322] border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-400 hidden sm:inline">พิกัดสถานที่:</span>
          <span className="text-slate-200 font-medium">{caseData.locationName}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-[11px] text-amber-300/90 font-mono hidden md:inline">
            💡 แตะตรวจวัตถุในที่เกิดเหตุ | กด &quot;ตรวจจับ AI&quot; เพื่อตีกรอบและวิเคราะห์ร่องรอย
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenVictimFile();
            }}
            className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all font-medium cursor-pointer ${
              isVictimButtonHighlighted
                ? 'bg-amber-400 text-black border-2 border-white shadow-[0_0_20px_rgba(251,191,36,0.9)] animate-pulse font-bold scale-105'
                : 'bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 shadow-sm'
            }`}
          >
            <User className="w-3 h-3" />
            <span>ตรวจสภาพศพ</span>
            {isVictimButtonHighlighted && (
              <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded-full uppercase">
                คลิกตรวจ
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

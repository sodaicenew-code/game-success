import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Plus,
  Edit3,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  MapPin,
  HelpCircle,
  FileText,
  User,
  Search,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Shuffle
} from 'lucide-react';
import { CaseStage, Clue, DiagnosisOption } from '../types';
import crimeTrainingSim from '../assets/images/crime_training_sim_1789545367031.jpg';
import crimeOfficeTox from '../assets/images/crime_office_tox_1789545367031.jpg';
import crimeKitchenBld from '../assets/images/crime_kitchen_bld_1789532873273.jpg';
import crimePoolWtr from '../assets/images/crime_pool_wtr_1789532884904.jpg';
import crimeBedroomGas from '../assets/images/crime_bedroom_gas_1789532860734.jpg';
import crimeAlleyVolt from '../assets/images/crime_alley_volt_1789532895771.jpg';

interface StageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: CaseStage[];
  currentCaseId: number;
  hideDefaultCases: boolean;
  onSaveCase: (updatedCase: CaseStage) => void;
  onDeleteCase: (caseId: number) => void;
  onToggleHideDefaults: (hide: boolean) => void;
  onResetToDefaults: () => void;
  onSelectCase: (index: number) => void;
}

const PRESET_SCENE_IMAGES = [
  { label: 'ห้องฝึกนิติเวช', url: crimeTrainingSim },
  { label: 'ห้องครัวเกิดเหตุ', url: crimeKitchenBld },
  { label: 'ห้องนอนที่เกิดเหตุ', url: crimeBedroomGas },
  { label: 'สระว่ายน้ำเกิดเหตุ', url: crimePoolWtr },
  { label: 'ตรอกเสาไฟฟ้า', url: crimeAlleyVolt },
];

export const StageManagerModal: React.FC<StageManagerModalProps> = ({
  isOpen,
  onClose,
  cases,
  currentCaseId,
  hideDefaultCases,
  onSaveCase,
  onDeleteCase,
  onToggleHideDefaults,
  onResetToDefaults,
  onSelectCase,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'edit' | 'manage'>('create');
  const [selectedCaseForEdit, setSelectedCaseForEdit] = useState<number>(currentCaseId);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State for creating or editing a stage
  const [editingId, setEditingId] = useState<number | null>(null);
  const [code, setCode] = useState(`CASE #${String(cases.length + 1).padStart(2, '0')}`);
  const [tag, setTag] = useState('คดีสืบสวนใหม่');
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [cameraText, setCameraText] = useState(`CAM ${String(cases.length + 1).padStart(2, '0')} // CRIME SCENE`);
  const [locationName, setLocationName] = useState('สถานที่เกิดเหตุ');
  const [environmentDesc, setEnvironmentDesc] = useState('');
  const [sceneImage, setSceneImage] = useState(PRESET_SCENE_IMAGES[0].url);

  // Victim State
  const [victimName, setVictimName] = useState('ไม่ทราบชื่อ-สกุล');
  const [victimGender, setVictimGender] = useState<'ชาย' | 'หญิง'>('ชาย');
  const [victimAge, setVictimAge] = useState('35 ปี');
  const [victimRole, setVictimRole] = useState('ผู้ประสบเหตุ');
  const [victimClothing, setVictimClothing] = useState('เสื้อยืด กางเกงยีนส์');
  const [victimBodyPosition, setVictimBodyPosition] = useState('นอนหงายบนพื้น');
  const [victimInitialSigns, setVictimInitialSigns] = useState('ไม่มีสัญญาณชีพ');
  const [primaryWound, setPrimaryWound] = useState('');
  const [weaponOrAgent, setWeaponOrAgent] = useState('');
  const [mannerHypothesis, setMannerHypothesis] = useState('');
  const [clueFindingGuide, setClueFindingGuide] = useState('');

  // Clues list
  const [clues, setClues] = useState<Clue[]>([
    {
      id: `c-new-1`,
      name: 'วัตถุต้องสงสัยชิ้นที่ 1',
      short: 'วัตถุพยาน 1',
      icon: 'Search',
      desc: 'พบวัตถุต้องสงสัยตกอยู่ในที่เกิดเหตุ',
      details: 'การตรวจพิสูจน์ทางนิติวิทยาศาสตร์พบร่องรอยสำคัญ',
      forensicCategory: 'พยานวัตถุ (Physical Evidence)',
      isRelatedToIncident: true,
      causeOfDeathHypothesis: 'สอดคล้องกับพฤติการณ์การเสียชีวิต',
      position: { x: 35, y: 65 },
    },
    {
      id: `c-new-2`,
      name: 'วัตถุต้องสงสัยชิ้นที่ 2',
      short: 'วัตถุพยาน 2',
      icon: 'Shield',
      desc: 'พบคราบหรือรอยแผลที่ต้องตรวจสอบ',
      details: 'ผลการตรวจชีวเคมีพบสารต้องสงสัย',
      forensicCategory: 'ชีววิทยาและพิษวิทยา (Bio-Toxicology)',
      isRelatedToIncident: true,
      causeOfDeathHypothesis: 'เชื่อมโยงกับสาเหตุการเสียชีวิตของเหยื่อ',
      position: { x: 65, y: 50 },
    },
  ]);

  const [activePinClueIndex, setActivePinClueIndex] = useState<number>(0);

  // Autopsy Quiz Question & Options
  const [question, setQuestion] = useState('จากหลักฐานทั้งหมดในที่เกิดเหตุ ผู้ตายเสียชีวิตจากสาเหตุใด?');
  const [options, setOptions] = useState<DiagnosisOption[]>([
    { text: 'สาเหตุข้อที่ 1 (ถูกต้อง)', correct: true, reason: 'หลักฐานทางนิติเวชวิทยาและวัตถุพยานตรงกัน' },
    { text: 'สาเหตุข้อที่ 2 (หลอก)', correct: false, reason: 'ไม่พบร่องรอยบาดแผลที่สอดคล้อง' },
    { text: 'สาเหตุข้อที่ 3 (หลอก)', correct: false, reason: 'ขัดแย้งกับผลการตรวจทางห้องปฏิบัติการ' },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagePreviewRef = useRef<HTMLDivElement>(null);

  // Notification helper
  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Load a case into form for editing
  const handleLoadCaseForEditing = (targetCaseId: number) => {
    const target = cases.find(c => c.id === targetCaseId);
    if (!target) return;

    setEditingId(target.id);
    setCode(target.code);
    setTag(target.tag);
    setTitle(target.title);
    setBrief(target.brief);
    setCameraText(target.cameraText);
    setLocationName(target.locationName);
    setEnvironmentDesc(target.environmentDesc || '');
    setSceneImage(target.sceneImage);

    // Victim
    setVictimName(target.victim.name);
    setVictimGender(target.victim.gender);
    setVictimAge(target.victim.age);
    setVictimRole(target.victim.role);
    setVictimClothing(target.victim.clothing);
    setVictimBodyPosition(target.victim.bodyPosition);
    setVictimInitialSigns(target.victim.initialSigns);
    setPrimaryWound(target.victim.woundAnalysis?.primaryWound || '');
    setWeaponOrAgent(target.victim.woundAnalysis?.weaponOrAgent || '');
    setMannerHypothesis(target.victim.woundAnalysis?.mannerHypothesis || '');
    setClueFindingGuide(target.victim.woundAnalysis?.clueFindingGuide || '');

    // Clues & Questions
    setClues(target.clues && target.clues.length > 0 ? target.clues : []);
    setQuestion(target.question);
    setOptions(target.options && target.options.length > 0 ? target.options : []);

    setActiveTab('edit');
    showNotice(`โหลดข้อมูลด่าน "${target.title}" เพื่อแก้ไขแล้ว`);
  };

  // Reset form to blank for new stage
  const handleStartNewStage = () => {
    const nextId = Math.max(0, ...cases.map(c => c.id)) + 1;
    setEditingId(null);
    setCode(`CASE #${String(nextId).padStart(2, '0')}`);
    setTag('คดีใหม่');
    setTitle(`คดีที่ ${nextId}: ปริศนาที่เกิดเหตุใหม่`);
    setBrief('รายงานการพบผู้เสียชีวิตในสถานที่เกิดเหตุ ตรวจสอบวัตถุพยานเพื่อหาสาเหตุการเสียชีวิต');
    setCameraText(`CAM ${String(nextId).padStart(2, '0')} // CRIME SCENE`);
    setLocationName('สถานที่เกิดเหตุ');
    setEnvironmentDesc('บริเวณที่เกิดเหตุปิดกั้นด้วยเทปเหลือง CSI');
    setSceneImage(PRESET_SCENE_IMAGES[0].url);

    setVictimName('นายสมชาย ไม่ทราบนามสกุล');
    setVictimGender('ชาย');
    setVictimAge('32 ปี');
    setVictimRole('บุคคลทั่วไป');
    setVictimClothing('เสื้อยืดสีดำ กางเกงยีนส์');
    setVictimBodyPosition('นอนตะแคงข้าง');
    setVictimInitialSigns('พบร่องรอยต้องสงสัย');
    setPrimaryWound('พบบาดแผลหรือรอยไหม้ภายนอก');
    setWeaponOrAgent('สารเคมีหรืออาวุธต้องสงสัย');
    setMannerHypothesis('คาดว่าน่าจะเสียชีวิตจากการถูกทำร้ายหรือสารพิษ');
    setClueFindingGuide('สังเกตบริเวณโต๊ะ พื้นห้อง และบริเวณใกล้ร่างผู้เสียชีวิต');

    setClues([
      {
        id: `c-${Date.now()}-1`,
        name: 'วัตถุพยานชิ้นที่ 1',
        short: 'วัตถุพยาน 1',
        icon: 'Search',
        desc: 'พบคราบสารหรือร่องรอยบนพื้นผิว',
        details: 'ผลตรวจทางเคมีพบสารตกค้าง',
        forensicCategory: 'พยานวัตถุ',
        isRelatedToIncident: true,
        position: { x: 35, y: 65 },
      },
      {
        id: `c-${Date.now()}-2`,
        name: 'วัตถุพยานชิ้นที่ 2',
        short: 'วัตถุพยาน 2',
        icon: 'Shield',
        desc: 'พบร่องรอยการต่อสู้หรือรอยไหม้',
        details: 'การตรวจพิสูจน์ยืนยันความผิดปกติ',
        forensicCategory: 'พยาธิวิทยา',
        isRelatedToIncident: true,
        position: { x: 65, y: 45 },
      },
    ]);

    setQuestion('จากหลักฐานทั้งหมด ผู้ตายเสียชีวิตจากสาเหตุใด?');
    setOptions([
      { text: 'สาเหตุการตายหลักที่ตรวจพบ (ข้อถูก)', correct: true, reason: 'หลักฐานทางนิติเวชตรงกับพยานวัตถุ' },
      { text: 'อุบัติเหตุทั่วไป (ข้อหลอก)', correct: false, reason: 'ไม่พบร่องรอยที่สอดคล้อง' },
      { text: 'โรคประจำตัวกำเริบ (ข้อหลอก)', correct: false, reason: 'ขัดแย้งกับผลตรวจทางพิษวิทยา' },
    ]);

    setActiveTab('create');
  };

  // Image Upload handler (File input or Drag-and-drop)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSceneImage(result);
        showNotice('อัปโหลดรูปภาพที่เกิดเหตุสำเร็จ!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Click on image preview to position the selected clue
  const handleImageClickPin = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imagePreviewRef.current) return;
    const rect = imagePreviewRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const percentX = Math.round(Math.max(5, Math.min(95, (clickX / rect.width) * 100)));
    const percentY = Math.round(Math.max(5, Math.min(95, (clickY / rect.height) * 100)));

    setClues(prev => {
      const updated = [...prev];
      if (updated[activePinClueIndex]) {
        updated[activePinClueIndex] = {
          ...updated[activePinClueIndex],
          position: { x: percentX, y: percentY },
        };
      }
      return updated;
    });

    showNotice(`ปักหมุดวัตถุพยาน #${activePinClueIndex + 1} ที่ตำแหน่ง X:${percentX}% Y:${percentY}%`);
  };

  // Add Clue item
  const handleAddClue = () => {
    const nextNum = clues.length + 1;
    const newClue: Clue = {
      id: `clue-${Date.now()}-${nextNum}`,
      name: `วัตถุพยานชิ้นที่ ${nextNum}`,
      short: `วัตถุพยาน ${nextNum}`,
      icon: 'Search',
      desc: 'วัตถุต้องสงสัยที่ตรวจพบเพิ่มเติมในที่เกิดเหตุ',
      details: 'รอผลตรวจทางห้องปฏิบัติการนิติเวช',
      forensicCategory: 'พยานวัตถุ',
      isRelatedToIncident: true,
      position: { x: 50, y: 50 },
    };
    setClues(prev => [...prev, newClue]);
    setActivePinClueIndex(clues.length);
  };

  // Remove Clue item
  const handleRemoveClue = (idx: number) => {
    if (clues.length <= 1) {
      alert('ด่านต้องมีวัตถุพยานอย่างน้อย 1 ชิ้น');
      return;
    }
    setClues(prev => prev.filter((_, i) => i !== idx));
    setActivePinClueIndex(0);
  };

  // Add Option
  const handleAddOption = () => {
    setOptions(prev => [
      ...prev,
      { text: `ตัวเลือกที่ ${prev.length + 1}`, correct: false, reason: 'คำอธิบายเหตุผล' },
    ]);
  };

  // Remove Option
  const handleRemoveOption = (idx: number) => {
    if (options.length <= 2) {
      alert('คำถามชันสูตรต้องมีอย่างน้อย 2 ตัวเลือก');
      return;
    }
    setOptions(prev => prev.filter((_, i) => i !== idx));
  };

  // Set correct option
  const handleSetCorrectOption = (idx: number) => {
    setOptions(prev =>
      prev.map((opt, i) => ({
        ...opt,
        correct: i === idx,
      }))
    );
  };

  // Shuffle options in editor
  const handleShuffleOptions = () => {
    if (options.length <= 1) return;
    const arr = [...options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOptions(arr);
    showNotice('สลับคละตำแหน่งตัวเลือกเรียบร้อย (Randomized Options)');
  };

  // Save or Update stage
  const handleSaveStage = () => {
    if (!title.trim()) {
      alert('กรุณาระบุชื่อคดี/ชื่อด่าน');
      return;
    }
    if (clues.length === 0) {
      alert('กรุณาเพิ่มวัตถุพยานอย่างน้อย 1 ชิ้น');
      return;
    }
    const hasCorrectOption = options.some(o => o.correct);
    if (!hasCorrectOption) {
      alert('กรุณาเลือกคำตอบที่ถูกต้องสำหรับคำถามชันสูตร');
      return;
    }

    const finalId = editingId ?? (Math.max(0, ...cases.map(c => c.id)) + 1);

    const newCaseStage: CaseStage = {
      id: finalId,
      code: code.trim() || `CASE #${finalId}`,
      tag: tag.trim() || 'คดีทั่วไป',
      title: title.trim(),
      brief: brief.trim() || 'คำบรรยายสรุปคดี',
      cameraText: cameraText.trim() || `CAM ${finalId} // CRIME SCENE`,
      locationName: locationName.trim() || 'สถานที่เกิดเหตุ',
      environmentDesc: environmentDesc.trim() || 'สถานที่เกิดเหตุ',
      sceneImage: sceneImage,
      victim: {
        name: victimName.trim() || 'ไม่ทราบนาม',
        gender: victimGender,
        genderEn: victimGender === 'ชาย' ? 'Male' : 'Female',
        age: victimAge.trim() || 'ไม่ระบุ',
        role: victimRole.trim() || 'ผู้ประสบเหตุ',
        clothing: victimClothing.trim() || 'ชุดทั่วไป',
        clothingDetails: [victimClothing.trim()],
        bodyPosition: victimBodyPosition.trim() || 'ไม่ระบุ',
        initialSigns: victimInitialSigns.trim() || 'ไม่มีสัญญาณชีพ',
        woundAnalysis: {
          primaryWound: primaryWound.trim() || 'ไม่พบบาดแผลชัดเจน',
          weaponOrAgent: weaponOrAgent.trim() || 'ไม่ทราบสารหรืออาวุธ',
          mannerHypothesis: mannerHypothesis.trim() || 'รอผลการชันสูตรพลิกศพ',
          clueFindingGuide: clueFindingGuide.trim() || 'สังเกตวัตถุพยานในบริเวณที่เกิดเหตุ',
        },
      },
      clues: clues,
      question: question.trim() || 'สาเหตุการเสียชีวิตคืออะไร?',
      options: options,
      isTutorial: false,
    };

    onSaveCase(newCaseStage);
    showNotice(`บันทึกด่าน "${newCaseStage.title}" เรียบร้อยแล้ว!`);
    
    // Automatically select newly saved case
    const targetIdx = cases.findIndex(c => c.id === finalId);
    if (targetIdx >= 0) {
      onSelectCase(targetIdx);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b101c] border border-cyan-500/40 max-w-4xl w-full h-[92vh] max-h-[850px] rounded-2xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="p-4 border-b border-slate-800 bg-[#0d1424] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-md">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-cyan-400">
                  CSI LAB STUDIO
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                  อัปโหลด & แก้ไขด่าน
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                ระบบจัดการด่านและอัปโหลดสถานที่เกิดเหตุ
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 pt-3 pb-2 bg-[#090d17] border-b border-slate-800 text-xs sm:text-sm font-semibold shrink-0 overflow-x-auto">
          <button
            onClick={handleStartNewStage}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'create'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>➕ เพิ่มด่านใหม่ / อัปโหลด</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('edit');
              handleLoadCaseForEditing(selectedCaseForEdit);
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'edit'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>✏️ แก้ไขด่านที่มีอยู่ ({cases.length} ด่าน)</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'manage'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>⚙️ จัดการข้อมูล & ล้างด่านเดิม</span>
          </button>
        </div>

        {/* Floating Notification Toast */}
        {notification && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-black px-4 py-2 rounded-xl text-xs font-bold shadow-xl border border-emerald-300 animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Main Body Content with scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
          
          {/* TAB 1 & 2: ADD / EDIT STAGE FORM */}
          {(activeTab === 'create' || activeTab === 'edit') && (
            <div className="space-y-6 max-w-3xl mx-auto">

              {/* Selector when editing existing case */}
              {activeTab === 'edit' && (
                <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs font-bold text-cyan-200">
                      เลือกด่านที่ต้องการแก้ไข:
                    </span>
                  </div>
                  <select
                    value={editingId || selectedCaseForEdit}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setSelectedCaseForEdit(id);
                      handleLoadCaseForEditing(id);
                    }}
                    className="w-full sm:w-auto bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}: {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* SECTION 1: CRIME SCENE PHOTO & PRESETS */}
              <div className="bg-[#111728] border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>รูปภาพสถานที่เกิดเหตุ (Crime Scene Photo)</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 hover:border-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>อัปโหลดรูปภาพใหม่ (จากมือถือ/คอม)</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Preset scene images */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-slate-400 shrink-0 text-[11px]">หรือเลือกภาพพร้อมใช้:</span>
                  {PRESET_SCENE_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSceneImage(preset.url)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] shrink-0 transition cursor-pointer ${
                        sceneImage === preset.url
                          ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Interactive Scene Preview with Pin Placement */}
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video max-h-[280px] select-none">
                  <img
                    src={sceneImage}
                    alt="Crime Scene Preview"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    ref={imagePreviewRef}
                    onClick={handleImageClickPin}
                    className="absolute inset-0 cursor-crosshair bg-black/10 hover:bg-black/5 transition"
                    title="แตะบนรูปภาพนี้เพื่อปักหมุดตำแหน่งวัตถุพยานที่เลือก"
                  >
                    {/* Render Clue Pins on Preview */}
                    {clues.map((clue, idx) => {
                      const isActive = idx === activePinClueIndex;
                      return (
                        <div
                          key={clue.id || idx}
                          style={{
                            left: `${clue.position.x}%`,
                            top: `${clue.position.y}%`,
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-all duration-200 ${
                            isActive ? 'scale-125 z-20' : 'scale-100 z-10 opacity-85'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-black shadow-lg border-2 ${
                              isActive
                                ? 'bg-amber-400 border-white ring-4 ring-amber-400/40'
                                : 'bg-cyan-400 border-cyan-100'
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <span className="absolute top-7 bg-black/90 border border-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap font-mono shadow">
                            {clue.short || clue.name}
                          </span>
                        </div>
                      );
                    })}

                    <div className="absolute bottom-2 right-2 bg-black/85 backdrop-blur-md border border-slate-700 px-2.5 py-1 rounded-lg text-[10px] text-amber-300 pointer-events-none font-mono">
                      👉 แตะบนภาพเพื่อปักหมุดวัตถุพยาน #{activePinClueIndex + 1}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: BASIC STAGE METADATA */}
              <div className="bg-[#111728] border border-slate-800 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>ข้อมูลทั่วไปของคดี (Case Dossier)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">รหัสคดี (Code)</label>
                    <input
                      type="text"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      placeholder="เช่น CASE #07"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">แท็กประเภทคดี (Tag)</label>
                    <input
                      type="text"
                      value={tag}
                      onChange={e => setTag(e.target.value)}
                      placeholder="เช่น ฆาตกรรม / สารพิษ"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">กล้อง CCTV (Camera Text)</label>
                    <input
                      type="text"
                      value={cameraText}
                      onChange={e => setCameraText(e.target.value)}
                      placeholder="CAM 07 // SCENE"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">ชื่อคดี (Title) *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="เช่น คดีฆาตกรรมในห้องปิดตาย"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">ชื่อสถานที่เกิดเหตุ (Location)</label>
                    <input
                      type="text"
                      value={locationName}
                      onChange={e => setLocationName(e.target.value)}
                      placeholder="เช่น บ้านพักส่วนตัว ซอยอารีย์"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">คำบรรยายสรุปเหตุการณ์ (Brief Summary)</label>
                  <textarea
                    rows={2}
                    value={brief}
                    onChange={e => setBrief(e.target.value)}
                    placeholder="สรุปสถานการณ์และเงื่อนงำเบื้องต้นที่เจ้าหน้าที่ตำรวจพบ..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* SECTION 3: VICTIM & AUTOPSY DETAILS */}
              <div className="bg-[#111728] border border-slate-800 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>ข้อมูลผู้เสียชีวิต & การชันสูตร (Victim Profile)</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">ชื่อผู้ตาย</label>
                    <input
                      type="text"
                      value={victimName}
                      onChange={e => setVictimName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">เพศ</label>
                    <select
                      value={victimGender}
                      onChange={e => setVictimGender(e.target.value as 'ชาย' | 'หญิง')}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="ชาย">ชาย</option>
                      <option value="หญิง">หญิง</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">อายุ</label>
                    <input
                      type="text"
                      value={victimAge}
                      onChange={e => setVictimAge(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">อาชีพ / บทบาท</label>
                    <input
                      type="text"
                      value={victimRole}
                      onChange={e => setVictimRole(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">ลักษณะเสื้อผ้าเครื่องแต่งกาย</label>
                    <input
                      type="text"
                      value={victimClothing}
                      onChange={e => setVictimClothing(e.target.value)}
                      placeholder="เช่น เสื้อสูทสีน้ำเงิน ผูกเนกไท"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">ท่านอนและสภาพศพแรกพบ</label>
                    <input
                      type="text"
                      value={victimBodyPosition}
                      onChange={e => setVictimBodyPosition(e.target.value)}
                      placeholder="เช่น นอนคว่ำหน้า มือเกร็ง"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="text-xs text-amber-400 block mb-1 font-semibold">
                      บาดแผลหลัก / ร่องรอยการเสียชีวิต
                    </label>
                    <input
                      type="text"
                      value={primaryWound}
                      onChange={e => setPrimaryWound(e.target.value)}
                      placeholder="เช่น บาดแผลถูกแทง หรือ Cyanosis ริมฝีปากเขียวคล้ำ"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-amber-400 block mb-1 font-semibold">
                      อาวุธหรือสารก่อเหตุที่ใช้
                    </label>
                    <input
                      type="text"
                      value={weaponOrAgent}
                      onChange={e => setWeaponOrAgent(e.target.value)}
                      placeholder="เช่น มีดทำครัว, สารไซยาไนด์, ไฟฟ้าช็อต"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    คำแนะนำชี้เป้าหาวัตถุพยานในสถานที่เกิดเหตุ (Clue Finding Guide สำหรับผู้เล่น)
                  </label>
                  <input
                    type="text"
                    value={clueFindingGuide}
                    onChange={e => setClueFindingGuide(e.target.value)}
                    placeholder="เช่น ตรวจดูรอยหยดเลือดที่พื้น และแก้วน้ำบนโต๊ะ..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* SECTION 4: FORENSIC CLUES LIST & PINNING */}
              <div className="bg-[#111728] border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>วัตถุพยานในที่เกิดเหตุ (Forensic Clues: {clues.length} ชิ้น)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddClue}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มวัตถุพยาน</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  คลิกเลือกวัตถุพยานด้านล่าง แล้วแตะบนรูปภาพด้านบนเพื่อปักหมุดตำแหน่ง X, Y ได้ทันที
                </p>

                <div className="space-y-3">
                  {clues.map((clue, idx) => {
                    const isSelected = idx === activePinClueIndex;
                    return (
                      <div
                        key={clue.id || idx}
                        onClick={() => setActivePinClueIndex(idx)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                isSelected ? 'bg-amber-400 text-black' : 'bg-slate-800 text-cyan-400'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-white">
                              วัตถุพยาน #{idx + 1} (X: {clue.position.x}%, Y: {clue.position.y}%)
                            </span>
                            {isSelected && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                                กำลังเลือกเพื่อปักหมุด
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveClue(idx);
                            }}
                            className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-950/50"
                            title="ลบวัตถุพยานนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-0.5">ชื่อพยานหลักฐาน</label>
                            <input
                              type="text"
                              value={clue.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setClues(prev =>
                                  prev.map((c, i) => (i === idx ? { ...c, name: val, short: val } : c))
                                );
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-cyan-400 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-0.5">หมวดหมู่</label>
                            <input
                              type="text"
                              value={clue.forensicCategory}
                              onChange={(e) => {
                                const val = e.target.value;
                                setClues(prev =>
                                  prev.map((c, i) => (i === idx ? { ...c, forensicCategory: val } : c))
                                );
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-cyan-400 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-0.5">ความสัมพันธ์กับคดี</label>
                            <select
                              value={clue.isRelatedToIncident ? 'true' : 'false'}
                              onChange={(e) => {
                                const isRel = e.target.value === 'true';
                                setClues(prev =>
                                  prev.map((c, i) => (i === idx ? { ...c, isRelatedToIncident: isRel } : c))
                                );
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-cyan-400 focus:outline-none"
                            >
                              <option value="true">✅ หลักฐานสำคัญเกี่ยวกับคดี</option>
                              <option value="false">❌ ของลวงตา / วัตถุแวดล้อม</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-2">
                          <label className="text-[11px] text-slate-400 block mb-0.5">คำอธิบายและรายละเอียดทางนิติเวช</label>
                          <input
                            type="text"
                            value={clue.desc}
                            onChange={(e) => {
                              const val = e.target.value;
                              setClues(prev =>
                                prev.map((c, i) => (i === idx ? { ...c, desc: val, details: val } : c))
                              );
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-cyan-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5: AUTOPSY QUIZ QUESTION & CHOICES */}
              <div className="bg-[#111728] border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>คำถามชันสูตรพลิกศพ (Forensic Diagnosis Question)</span>
                  </h3>
                  <div className="flex items-center gap-1.5">
                    {options.length > 1 && (
                      <button
                        type="button"
                        onClick={handleShuffleOptions}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="สลับคละลำดับตัวเลือกคำตอบแบบสุ่ม"
                      >
                        <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                        <span>สลับสุ่มช้อยส์</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>เพิ่มตัวเลือกคำตอบ</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">คำถามสรุปคดี</label>
                  <input
                    type="text"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="เช่น จากพยานหลักฐานในที่เกิดเหตุ ผู้ตายเสียชีวิตจากสาเหตุใด?"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-xs text-slate-400 block">
                    ตัวเลือกคำตอบ (ติ๊กเลือกข้อที่ถูกต้อง):
                  </span>

                  {options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center gap-2 transition ${
                        opt.correct
                          ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSetCorrectOption(idx)}
                        className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 ${
                          opt.correct
                            ? 'bg-emerald-500 text-slate-950 shadow'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{opt.correct ? 'คำตอบที่ถูก ✅' : 'ตั้งเป็นข้อถูก'}</span>
                      </button>

                      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOptions(prev =>
                              prev.map((o, i) => (i === idx ? { ...o, text: val } : o))
                            );
                          }}
                          placeholder="ข้อความตัวเลือก..."
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-cyan-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={opt.reason}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOptions(prev =>
                              prev.map((o, i) => (i === idx ? { ...o, reason: val } : o))
                            );
                          }}
                          placeholder="คำอธิบายเฉลยว่าทำไมถูก/ผิด..."
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="text-red-400 hover:text-red-300 p-1 self-end sm:self-center"
                        title="ลบตัวเลือกนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="pt-2 pb-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSaveStage}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingId ? 'บันทึกการแก้ไขด่านนี้' : 'บันทึกและเพิ่มด่านใหม่'}</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: MANAGE CASES & CLEAR/REPLACE ORIGINAL CASES */}
          {activeTab === 'manage' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* CLEAR ORIGINAL CASES CARD ("เเละข้อมูลเดิมที่มีอยู่จะหายไป") */}
              <div className="bg-amber-950/20 border-2 border-amber-500/60 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-amber-300">
                      ตัวเลือกล้างด่านเดิม (Replace Original Cases)
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      ตามคำขอของคุณ หากต้องการให้ <strong>"ข้อมูลเดิมที่มีอยู่จะหายไป"</strong> และแสดงเฉพาะด่านที่คุณสร้างหรือเพิ่มใหม่ สามารถกดปุ่มด้านล่างเพื่อล้างด่านเริ่มต้นออกได้ทันที
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (window.confirm('คุณต้องการล้างด่านเดิมออกทั้งหมด เพื่อใช้เฉพาะด่านที่คุณสร้างขึ้นเองใช่หรือไม่?')) {
                        onToggleHideDefaults(true);
                        showNotice('ล้างด่านเดิมออกแล้ว เหลือเฉพาะด่านที่เพิ่มใหม่');
                      }
                    }}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition ${
                      hideDefaultCases
                        ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                        : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>
                      {hideDefaultCases
                        ? '✓ ล้างด่านเดิมเรียบร้อยแล้ว (กำลังซ่อนด่านเดิม)'
                        : '🗑️ ล้างด่านเดิมทั้งหมด (แสดงเฉพาะด่านที่สร้างใหม่)'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      onResetToDefaults();
                      showNotice('กู้คืนด่านมาตรฐานทั้ง 6 ด่านเรียบร้อยแล้ว');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>กู้คืนด่านมาตรฐานเริ่มต้น (Restore)</span>
                  </button>
                </div>
              </div>

              {/* LIST OF CURRENT CASES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-cyan-300">
                    แฟ้มคดีในระบบปัจจุบัน ({cases.length} ด่าน)
                  </h4>
                  <button
                    onClick={handleStartNewStage}
                    className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer border border-cyan-500/40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มด่านใหม่</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {cases.map((c, index) => (
                    <div
                      key={c.id}
                      className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-slate-800 text-cyan-400 border border-cyan-500/20">
                            {c.code}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {c.tag}
                          </span>
                          <span className="text-[10px] text-amber-400 font-mono">
                            {c.clues?.length || 0} วัตถุพยาน
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-white truncate">
                          {c.title}
                        </h5>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            onSelectCase(index);
                            onClose();
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-500/30 text-xs font-bold cursor-pointer"
                          title="เริ่มเล่นด่านนี้"
                        >
                          เข้าเล่น
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCaseForEdit(c.id);
                            handleLoadCaseForEditing(c.id);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                          title="แก้ไขด่านนี้"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`ต้องการลบด่าน "${c.title}" หรือไม่?`)) {
                              onDeleteCase(c.id);
                              showNotice(`ลบด่าน "${c.title}" แล้ว`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:text-red-300 hover:bg-red-950/60 cursor-pointer"
                          title="ลบด่านนี้"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

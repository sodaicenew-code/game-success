export interface ForensicTrace {
  id: string;
  name: string;
  type: 'chemical' | 'blood' | 'fingerprint' | 'scratch' | 'burn' | 'fiber' | 'cyanosis' | 'droplet' | 'other';
  description: string;
  locationLabel: string;
  pinX: number; // 0 - 100 percentage inside the evidence macro view
  pinY: number; // 0 - 100 percentage inside the evidence macro view
}

export interface ForensicBoundingBox {
  id: string;
  label: string;
  category: string;
  confidence: number; // e.g. 0.95
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width: number; // percentage 0 - 100
  height: number; // percentage 0 - 100
  color: string;
  traceDetails: string;
  suspiciousCue?: string;
  evidenceImage?: string;
  clueId?: string;
  isUserDrawn?: boolean;
  isRelatedToIncident?: boolean; // true = key case evidence, false = ambient object / not related
  causeOfDeathHypothesis?: string; // ข้อสันนิษฐานว่าคาดน่าจะเสียชีวิตเพราะอะไร
  unrelatedExplanation?: string; // คำอธิบายว่าของนี้ไม่เกี่ยวกับเหตุการณ์อย่างไร
}

export interface Clue {
  id: string;
  name: string;
  short: string;
  icon: string;
  badgeColor?: string;
  desc: string;
  details: string;
  forensicCategory: string;
  isRelatedToIncident?: boolean; // true = key case evidence, false = ambient object / not related
  causeOfDeathHypothesis?: string; // ข้อสันนิษฐานว่าคาดน่าจะเสียชีวิตเพราะอะไร
  unrelatedExplanation?: string; // คำอธิบายว่าของนี้ไม่เกี่ยวกับเหตุการณ์อย่างไร
  blemish?: {
    label: string;
    sublabel: string;
    markType:
      | 'blood_stain'
      | 'poison_powder'
      | 'froth_mucus'
      | 'burn_mark'
      | 'spark_arc'
      | 'cyanosis_discoloration'
      | 'tear_wound'
      | 'chemical_sachet'
      | 'tape_seal'
      | 'water_slip';
    hint: string;
  };
  itemType?: 
    | 'knife' 
    | 'wound' 
    | 'blood_spatter' 
    | 'coffee' 
    | 'cyanosis' 
    | 'powder_foil' 
    | 'froth' 
    | 'algae' 
    | 'wet_clothes' 
    | 'brazier' 
    | 'tape' 
    | 'cherry_skin' 
    | 'spark_wire' 
    | 'joule_burn' 
    | 'water_puddle';
  position: {
    x: number; // percentage from left 0-100
    y: number; // percentage from top 0-100
  };
  evidenceImage?: string; // High-res macro photo of the evidence
  suspiciousVisualCue?: string; // Clear visual sign why it is suspicious
  closeUpAnalysis?: string; // Detailed forensic close-up breakdown
  forensicTraces?: ForensicTrace[]; // Microscopic traces revealed upon zooming
}

export interface DiagnosisOption {
  text: string;
  correct: boolean;
  reason: string;
}

export interface WoundAnalysis {
  primaryWound: string; // ลักษณะบาดแผลหลัก
  weaponOrAgent: string; // อาวุธหรือสารก่อเหตุที่ใช้
  mannerHypothesis: string; // วิเคราะห์ว่าน่าจะเสียชีวิตเพราะอะไร หรือโดนฆ่าจากอะไร
  clueFindingGuide: string; // คำแนะนำชี้เป้าหาของต้องสงสัยในสถานที่เกิดเหตุ (เผื่อหาไม่เจอ)
}

export interface VictimProfile {
  name: string;
  gender: 'ชาย' | 'หญิง';
  genderEn: 'Male' | 'Female';
  age: string;
  role: string;
  clothing: string;
  clothingDetails: string[];
  bodyPosition: string;
  initialSigns: string;
  woundAnalysis?: WoundAnalysis;
  position?: {
    x: number;
    y: number;
  };
}

export interface CaseStage {
  id: number;
  code: string;
  tag: string;
  title: string;
  brief: string;
  cameraText: string;
  locationName: string;
  environmentDesc: string;
  sceneImage: string;
  victim: VictimProfile;
  clues: Clue[];
  question: string;
  options: DiagnosisOption[];
  isTutorial?: boolean;
}

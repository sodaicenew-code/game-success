import { useState, useMemo } from 'react';
import { CASE_STAGES } from './data/cases';
import { Clue, CaseStage } from './types';
import { sound } from './utils/audio';
import {
  getStoredCaseState,
  saveCustomCase,
  deleteCustomCase,
  toggleHideDefaultCases,
  resetAllCasesToDefault,
} from './utils/caseStorage';
import { Header } from './components/Header';
import { CaseBriefCard } from './components/CaseBriefCard';
import { CrimeSceneViewer } from './components/CrimeSceneViewer';
import { EvidenceTray } from './components/EvidenceTray';
import { AutopsySection } from './components/AutopsySection';
import { EvidenceModal } from './components/EvidenceModal';
import { VictoryModal } from './components/VictoryModal';
import { CaseSelectorModal } from './components/CaseSelectorModal';
import { VictimInspectorModal } from './components/VictimInspectorModal';
import { TutorialModal } from './components/TutorialModal';
import { TutorialGuideHUD } from './components/TutorialGuideHUD';
import { StageManagerModal } from './components/StageManagerModal';
import { TutorialCenterBanner } from './components/TutorialCenterBanner';

export default function App() {
  const [caseState, setCaseState] = useState(() => getStoredCaseState());
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active cases list from storage, fallback to default cases if empty
  const activeCases = useMemo(() => {
    return caseState.cases.length > 0 ? caseState.cases : CASE_STAGES;
  }, [caseState.cases]);

  // Safe current stage index
  const safeStageIndex = Math.min(currentStageIndex, Math.max(0, activeCases.length - 1));
  const currentCase = activeCases[safeStageIndex] || CASE_STAGES[0];

  // Map of caseId -> Set of collected clueIds
  const [collectedCluesMap, setCollectedCluesMap] = useState<Record<number, Set<string>>>({
    1: new Set<string>(),
    2: new Set<string>(),
    3: new Set<string>(),
    4: new Set<string>(),
    5: new Set<string>(),
    6: new Set<string>(),
  });

  // Set of solved case IDs
  const [solvedCaseIds, setSolvedCaseIds] = useState<Set<number>>(new Set());

  // Modal States
  const [activeModalClue, setActiveModalClue] = useState<Clue | null>(null);
  const [isCaseSelectorOpen, setIsCaseSelectorOpen] = useState(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const [isVictimModalOpen, setIsVictimModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [isStageManagerOpen, setIsStageManagerOpen] = useState(false);
  const [showTutorialCenterBanner, setShowTutorialCenterBanner] = useState(true);

  const currentCollectedClues = useMemo(() => {
    return collectedCluesMap[currentCase.id] || new Set<string>();
  }, [collectedCluesMap, currentCase.id]);

  const isCurrentCaseUnlocked = currentCollectedClues.size >= currentCase.clues.length;

  // Compute active tutorial target beacon for CrimeSceneViewer in stage 1
  const tutorialTarget = useMemo(() => {
    if (!currentCase.isTutorial) return null;
    if (!currentCollectedClues.has('t-cup')) {
      return { x: 44, y: 64, label: '👉 แตะตรงนี้: แก้วน้ำมีคราบขาว' };
    }
    if (!currentCollectedClues.has('t-lips')) {
      return { x: 57, y: 53, label: '👉 แตะตรงนี้: ริมฝีปากเขียวคล้ำ' };
    }
    if (!currentCollectedClues.has('t-sachet')) {
      return { x: 35, y: 82, label: '👉 แตะตรงนี้: ซองฟอยล์ตกใต้โต๊ะ' };
    }
    return null;
  }, [currentCase.isTutorial, currentCollectedClues]);

  const isVictimButtonHighlighted = Boolean(
    currentCase.isTutorial &&
    currentCollectedClues.size >= 3 &&
    !solvedCaseIds.has(currentCase.id) &&
    !isVictimModalOpen
  );

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  const handleCollectClueByIndex = (index: number) => {
    const clue = currentCase.clues[index];
    if (!clue) return;

    sound.playClue();

    setCollectedCluesMap(prev => {
      const currentSet = new Set(prev[currentCase.id] || []);
      currentSet.add(clue.id);
      return {
        ...prev,
        [currentCase.id]: currentSet,
      };
    });
  };

  const handleInspectClue = (clue: Clue) => {
    sound.playClue();
    setActiveModalClue(clue);
  };

  const handleCaseSolved = () => {
    if (!solvedCaseIds.has(currentCase.id)) {
      setSolvedCaseIds(prev => new Set(prev).add(currentCase.id));
      setScore(prev => prev + 20);
    }
  };

  const handleProceedNext = () => {
    if (safeStageIndex + 1 < activeCases.length) {
      setCurrentStageIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      sound.playVictory();
      setIsVictoryModalOpen(true);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCurrentStageIndex(0);
    setCollectedCluesMap({
      1: new Set<string>(),
      2: new Set<string>(),
      3: new Set<string>(),
      4: new Set<string>(),
      5: new Set<string>(),
      6: new Set<string>(),
    });
    setSolvedCaseIds(new Set());
    setIsVictoryModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToAutopsy = () => {
    const autopsyElem = document.getElementById('autopsy-section');
    if (autopsyElem) {
      autopsyElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Case Management Handlers
  const handleSaveStage = (savedCase: CaseStage) => {
    saveCustomCase(savedCase);
    const updated = getStoredCaseState();
    setCaseState(updated);
    // Switch to the newly saved/edited case
    const targetIdx = updated.cases.findIndex(c => c.id === savedCase.id);
    if (targetIdx !== -1) {
      setCurrentStageIndex(targetIdx);
    }
  };

  const handleDeleteStage = (caseId: number) => {
    deleteCustomCase(caseId);
    const updated = getStoredCaseState();
    setCaseState(updated);
    setCurrentStageIndex(0);
  };

  const handleToggleHideDefaults = () => {
    toggleHideDefaultCases();
    const updated = getStoredCaseState();
    setCaseState(updated);
    setCurrentStageIndex(0);
  };

  const handleResetDefaults = () => {
    resetAllCasesToDefault();
    const updated = getStoredCaseState();
    setCaseState(updated);
    setCurrentStageIndex(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Top CSI Bar */}
      <Header
        currentStage={safeStageIndex + 1}
        totalStages={activeCases.length}
        score={score}
        maxScore={activeCases.length * 20}
        isTutorial={currentCase.isTutorial}
        onOpenSelector={() => setIsCaseSelectorOpen(true)}
        onOpenTutorial={() => {
          if (currentCase.isTutorial) {
            setShowTutorialCenterBanner(true);
          } else {
            setIsTutorialModalOpen(true);
          }
        }}
        onOpenStageManager={() => setIsStageManagerOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-3 sm:px-4 pt-3 sm:pt-4 pb-12 space-y-4">
        {/* Tutorial Guided Walkthrough Bar when on Stage 1 */}
        {currentCase.isTutorial && (
          <TutorialGuideHUD
            caseData={currentCase}
            collectedClues={currentCollectedClues}
            isCaseSolved={solvedCaseIds.has(currentCase.id)}
            onProceedNext={handleProceedNext}
            onOpenVictimFile={() => setIsVictimModalOpen(true)}
            onScrollToAutopsy={handleScrollToAutopsy}
          />
        )}

        {/* Case Dossier Card */}
        <CaseBriefCard
          caseData={currentCase}
          collectedCount={currentCollectedClues.size}
          totalClues={currentCase.clues.length}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenVictimFile={() => setIsVictimModalOpen(true)}
        />

        {/* Crime Scene Viewer */}
        <CrimeSceneViewer
          caseData={currentCase}
          collectedClues={currentCollectedClues}
          onSelectClue={handleCollectClueByIndex}
          onOpenClueModal={handleInspectClue}
          onOpenVictimFile={() => setIsVictimModalOpen(true)}
          tutorialTarget={tutorialTarget}
          isVictimButtonHighlighted={isVictimButtonHighlighted}
          onOpenStageManager={() => setIsStageManagerOpen(true)}
        />

        {/* Collected Evidence Tray */}
        <EvidenceTray
          caseData={currentCase}
          collectedClues={currentCollectedClues}
          onInspectClue={handleInspectClue}
        />

        {/* Forensic Autopsy Section */}
        <div id="autopsy-section">
          <AutopsySection
            caseData={currentCase}
            isUnlocked={isCurrentCaseUnlocked}
            collectedCount={currentCollectedClues.size}
            totalClues={currentCase.clues.length}
            onSolved={handleCaseSolved}
            onProceedNext={handleProceedNext}
            isLastCase={safeStageIndex === activeCases.length - 1}
            sound={{
              playCorrect: () => sound.playCorrect(),
              playWrong: () => sound.playWrong(),
            }}
            onOpenSelector={() => setIsCaseSelectorOpen(true)}
            onOpenStageManager={() => setIsStageManagerOpen(true)}
          />
        </div>
      </main>

      {/* Tutorial Center Banner ("ตรงหน้าเเรกขอขึ้นตรงกลางจอว่าโหมดฝึกสอน") */}
      {currentCase.isTutorial && safeStageIndex === 0 && (
        <TutorialCenterBanner
          isOpen={showTutorialCenterBanner}
          onClose={() => setShowTutorialCenterBanner(false)}
          onStartGuide={() => {
            setShowTutorialCenterBanner(false);
            window.scrollTo({ top: 120, behavior: 'smooth' });
          }}
          collectedCount={currentCollectedClues.size}
          totalClues={currentCase.clues.length}
        />
      )}

      {/* Stage Studio / Upload / Add / Edit Modal ("ช่วยทำให้เเก้ไขเเละเพิ่มด่านใหม่ได้หน่อย ให้อยู่ในส่วนเดียวกับตอนอัพโหลดอะ") */}
      <StageManagerModal
        isOpen={isStageManagerOpen}
        onClose={() => setIsStageManagerOpen(false)}
        cases={caseState.cases}
        hideDefaults={caseState.hideDefaultCases}
        onSaveCase={handleSaveStage}
        onDeleteCase={handleDeleteStage}
        onToggleHideDefaults={handleToggleHideDefaults}
        onResetDefaults={handleResetDefaults}
      />

      {/* Tutorial & Gameplay Instructions Modal */}
      <TutorialModal
        isOpen={isTutorialModalOpen}
        onClose={() => setIsTutorialModalOpen(false)}
        onStartTutorial={() => {
          setCurrentStageIndex(0);
          setShowTutorialCenterBanner(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Clue Details Lab Modal */}
      <EvidenceModal
        clue={activeModalClue}
        onClose={() => setActiveModalClue(null)}
      />

      {/* Victim & Attire Detailed Inspector Modal */}
      <VictimInspectorModal
        caseData={currentCase}
        isOpen={isVictimModalOpen}
        onClose={() => setIsVictimModalOpen(false)}
      />

      {/* Case Selector Modal */}
      <CaseSelectorModal
        isOpen={isCaseSelectorOpen}
        onClose={() => setIsCaseSelectorOpen(false)}
        cases={activeCases}
        currentCaseId={currentCase.id}
        solvedCaseIds={solvedCaseIds}
        onSelectCase={idx => {
          setCurrentStageIndex(idx);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenStageManager={() => setIsStageManagerOpen(true)}
      />

      {/* Victory / Final Summary Modal */}
      {isVictoryModalOpen && (
        <VictoryModal
          score={score}
          totalPossibleScore={activeCases.length * 20}
          cases={activeCases}
          solvedCaseIds={solvedCaseIds}
          onRestart={handleRestart}
          onSelectCase={idx => {
            setCurrentStageIndex(idx);
            setIsVictoryModalOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenStageManager={() => {
            setIsVictoryModalOpen(false);
            setIsStageManagerOpen(true);
          }}
          onClose={() => setIsVictoryModalOpen(false)}
        />
      )}
    </div>
  );
}

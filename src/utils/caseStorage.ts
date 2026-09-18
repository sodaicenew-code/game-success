import { CaseStage } from '../types';
import { CASE_STAGES } from '../data/cases';

const STORAGE_CASES_KEY = 'csi_forensic_custom_cases_v2';
const STORAGE_HIDE_DEFAULTS_KEY = 'csi_forensic_hide_defaults_v2';

export interface CaseStorageState {
  cases: CaseStage[];
  hideDefaultCases: boolean;
  hasCustomized: boolean;
}

/**
 * Loads the active list of cases from localStorage.
 * If user toggled hideDefaultCases, original default cases will disappear.
 */
export function getStoredCaseState(): CaseStorageState {
  try {
    const hideDefaults = localStorage.getItem(STORAGE_HIDE_DEFAULTS_KEY) === 'true';
    const customCasesJson = localStorage.getItem(STORAGE_CASES_KEY);
    
    if (customCasesJson) {
      const parsedCases: CaseStage[] = JSON.parse(customCasesJson);
      if (Array.isArray(parsedCases) && parsedCases.length > 0) {
        if (hideDefaults) {
          // Keep only user custom cases or cases created/saved
          return {
            cases: parsedCases,
            hideDefaultCases: true,
            hasCustomized: true,
          };
        } else {
          // Merge or use parsedCases
          return {
            cases: parsedCases,
            hideDefaultCases: false,
            hasCustomized: true,
          };
        }
      }
    }

    if (hideDefaults) {
      // User chose to clear original cases but hasn't added custom ones yet
      return {
        cases: [],
        hideDefaultCases: true,
        hasCustomized: true,
      };
    }

    // Default: use built-in cases
    return {
      cases: CASE_STAGES,
      hideDefaultCases: false,
      hasCustomized: false,
    };
  } catch (err) {
    console.error('Failed to load case storage:', err);
    return {
      cases: CASE_STAGES,
      hideDefaultCases: false,
      hasCustomized: false,
    };
  }
}

/**
 * Saves the entire cases array to localStorage
 */
export function saveCasesList(cases: CaseStage[]): void {
  try {
    localStorage.setItem(STORAGE_CASES_KEY, JSON.stringify(cases));
  } catch (err) {
    console.error('Failed to save cases list:', err);
  }
}

/**
 * Toggles whether default original cases should disappear
 */
export function setHideDefaultCases(hide: boolean, currentCases: CaseStage[]): CaseStage[] {
  try {
    localStorage.setItem(STORAGE_HIDE_DEFAULTS_KEY, hide ? 'true' : 'false');
    
    if (hide) {
      // Filter out default case IDs 1..6 unless they were customized
      const customOnly = currentCases.filter(c => c.id > 6);
      localStorage.setItem(STORAGE_CASES_KEY, JSON.stringify(customOnly));
      return customOnly;
    } else {
      // If unhiding, ensure default cases are merged back if missing
      const existingIds = new Set(currentCases.map(c => c.id));
      const merged = [...currentCases];
      for (const defCase of CASE_STAGES) {
        if (!existingIds.has(defCase.id)) {
          merged.push(defCase);
        }
      }
      // Sort so tutorial/lower ids come first
      merged.sort((a, b) => a.id - b.id);
      localStorage.setItem(STORAGE_CASES_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.error('Failed to set hide defaults:', err);
    return currentCases;
  }
}

/**
 * Resets back to standard 6 default cases
 */
export function resetCasesToDefault(): CaseStage[] {
  try {
    localStorage.removeItem(STORAGE_CASES_KEY);
    localStorage.removeItem(STORAGE_HIDE_DEFAULTS_KEY);
  } catch (err) {
    console.error('Failed to reset cases:', err);
  }
  return CASE_STAGES;
}

export const resetAllCasesToDefault = resetCasesToDefault;

/**
 * Saves or updates a single custom case
 */
export function saveCustomCase(newOrUpdatedCase: CaseStage): CaseStage[] {
  const state = getStoredCaseState();
  const existingCases = state.cases;
  const index = existingCases.findIndex(c => c.id === newOrUpdatedCase.id);

  let updatedList: CaseStage[];
  if (index >= 0) {
    updatedList = [...existingCases];
    updatedList[index] = newOrUpdatedCase;
  } else {
    updatedList = [...existingCases, newOrUpdatedCase];
  }

  saveCasesList(updatedList);
  return updatedList;
}

/**
 * Deletes a case by its ID
 */
export function deleteCustomCase(caseId: number): CaseStage[] {
  const state = getStoredCaseState();
  const updatedList = state.cases.filter(c => c.id !== caseId);
  saveCasesList(updatedList);
  return updatedList;
}

/**
 * Toggles hiding default cases and returns updated case list
 */
export function toggleHideDefaultCases(): CaseStage[] {
  const state = getStoredCaseState();
  const newHide = !state.hideDefaultCases;
  return setHideDefaultCases(newHide, state.cases);
}

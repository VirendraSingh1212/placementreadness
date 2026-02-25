// localStorage persistence for analysis history

const STORAGE_KEY = "placement_readiness_history";

/**
 * Get all history entries from localStorage
 */
export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading history from localStorage:", error);
    return [];
  }
}

/**
 * Save a new analysis entry to localStorage
 */
export function saveToHistory(analysisResult) {
  try {
    const history = getHistory();
    const entry = {
      id: generateId(),
      createdAt: analysisResult.createdAt,
      company: analysisResult.company,
      role: analysisResult.role,
      jdText: analysisResult.jdText,
      extractedSkills: analysisResult.extractedSkills,
      plan: analysisResult.plan,
      checklist: analysisResult.checklist,
      questions: analysisResult.questions,
      readinessScore: analysisResult.readinessScore,
    };

    // Add to beginning (newest first)
    const updatedHistory = [entry, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));

    return entry;
  } catch (error) {
    console.error("Error saving to history:", error);
    throw error;
  }
}

/**
 * Get a specific history entry by ID
 */
export function getHistoryEntry(id) {
  const history = getHistory();
  return history.find((entry) => entry.id === id) || null;
}

/**
 * Delete a history entry by ID
 */
export function deleteHistoryEntry(id) {
  try {
    const history = getHistory();
    const updatedHistory = history.filter((entry) => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error("Error deleting history entry:", error);
    return false;
  }
}

/**
 * Clear all history
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing history:", error);
    return false;
  }
}

/**
 * Generate a unique ID
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format date for display
 */
export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get the most recent analysis (for results page default)
 */
export function getLatestAnalysis() {
  const history = getHistory();
  return history[0] || null;
}

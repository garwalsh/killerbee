/**
 * LocalStorage utilities for persisting game state
 */

interface SavedProgress {
  date: string;
  foundWords: string[];
  score: number;
  lastPlayed: number;
}

const STORAGE_KEY = 'wordhive-progress';

/**
 * Save current game progress to localStorage
 */
export function saveProgress(date: string, foundWords: string[], score: number): void {
  try {
    const progress: SavedProgress = {
      date,
      foundWords,
      score,
      lastPlayed: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn('Failed to save progress:', error);
  }
}

/**
 * Load saved progress from localStorage
 * Returns null if no save exists or if it's from a different date
 */
export function loadProgress(currentDate: string): SavedProgress | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const progress: SavedProgress = JSON.parse(stored);

    // Only return progress if it's from the same date
    if (progress.date !== currentDate) {
      return null;
    }

    return progress;
  } catch (error) {
    console.warn('Failed to load progress:', error);
    return null;
  }
}

/**
 * Clear all saved progress (useful for testing)
 */
export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear progress:', error);
  }
}

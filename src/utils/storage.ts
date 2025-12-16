/**
 * LocalStorage utilities for persisting game state
 */

interface SavedProgress {
  date: string;
  strategy: string;
  foundWords: string[];
  score: number;
  lastPlayed: number;
}

const STORAGE_KEY_PREFIX = 'killerbee-progress';

/**
 * Get storage key for a specific strategy
 */
function getStorageKey(strategy: string): string {
  return `${STORAGE_KEY_PREFIX}-${strategy}`;
}

/**
 * Save current game progress to localStorage
 */
export function saveProgress(
  date: string,
  strategy: string,
  foundWords: string[],
  score: number
): void {
  try {
    const progress: SavedProgress = {
      date,
      strategy,
      foundWords,
      score,
      lastPlayed: Date.now(),
    };
    localStorage.setItem(getStorageKey(strategy), JSON.stringify(progress));
  } catch (error) {
    console.warn('Failed to save progress:', error);
  }
}

/**
 * Load saved progress from localStorage
 * Returns null if no save exists or if it's from a different date
 */
export function loadProgress(currentDate: string, strategy: string): SavedProgress | null {
  try {
    const stored = localStorage.getItem(getStorageKey(strategy));
    if (!stored) return null;

    const progress: SavedProgress = JSON.parse(stored);

    // Only return progress if it's from the same date and strategy
    if (progress.date !== currentDate || progress.strategy !== strategy) {
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
export function clearProgress(strategy?: string): void {
  try {
    if (strategy) {
      // Clear specific strategy
      localStorage.removeItem(getStorageKey(strategy));
    } else {
      // Clear all strategies
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.warn('Failed to clear progress:', error);
  }
}

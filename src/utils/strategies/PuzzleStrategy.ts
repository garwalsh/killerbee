/**
 * Interface for puzzle generation strategies
 *
 * Each strategy determines how to:
 * 1. Generate a set of 7 letters (with one center letter)
 * 2. Find valid words from those letters
 */
export interface PuzzleStrategy {
  /**
   * Unique identifier for this strategy
   */
  readonly name: string;

  /**
   * Human-readable description of how this strategy works
   */
  readonly description: string;

  /**
   * Generate a letter set for the puzzle
   * @param rng - Seeded random number generator function (returns 0-1)
   * @returns Object with all 7 letters and the required center letter
   */
  generateLetterSet(rng: () => number): {
    letters: string[];
    center: string;
  };

  /**
   * Find all valid words that can be made from the given letters
   * Must include the center letter and be at least 4 characters
   *
   * @param letters - All 7 letters in the puzzle
   * @param centerLetter - The required letter that must appear in all words
   * @returns Array of valid words (should be pre-sorted by desired difficulty)
   */
  findValidWords(letters: string[], centerLetter: string): string[];
}

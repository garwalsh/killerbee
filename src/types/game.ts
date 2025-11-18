/**
 * Core type definitions for the WordHive game
 */

/**
 * Breakdown of how a word scores points
 */
export interface WordScore {
  word: string;
  baseScore: number;        // 1 for 4-letter words, length for 5+ letter words
  rarityBonus: number;      // 0-10 based on frequency decile
  isPangram: boolean;       // Uses all 7 letters
  pangramBonus: number;     // 10 if pangram, 0 otherwise
  totalScore: number;       // Sum of all bonuses
  rarityDecile: number;     // 1-10 (1=most common, 10=rarest)
}

/**
 * A daily puzzle with all its valid words and scoring
 */
export interface Puzzle {
  letters: string[];                    // All 7 letters (includes center letter)
  centerLetter: string;                 // The required letter
  validWords: Set<string>;              // All possible words for this puzzle
  wordScores: Map<string, WordScore>;   // Word → score breakdown
  maxScore: number;                     // Sum of all possible points
  totalWords: number;                   // Count of all possible words
}

/**
 * Current state of the game
 */
export interface GameState {
  puzzle: Puzzle;
  foundWords: string[];      // Words the player has found
  currentWord: string;       // Word currently being typed
  score: number;             // Current score
  shuffledOrder: number[];   // Indices for letter display order (0-6)
  message: Message | null;   // Current feedback message
}

/**
 * Feedback message types
 */
export type MessageType = 'error' | 'success' | 'rare' | 'pangram';

/**
 * Feedback message to display to the user
 */
export interface Message {
  type: MessageType;
  text: string;
  timestamp: number;  // When the message was created
}

/**
 * Validation result for a submitted word
 */
export interface ValidationResult {
  valid: boolean;
  reason?: string;  // If invalid, why?
}

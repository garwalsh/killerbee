/**
 * React hook for managing game state
 */

import { useState, useCallback, useEffect } from 'react';
import type { GameState, Message, MessageType } from '../types/game';
import { generatePuzzle, getTodayDateSeed, getActiveStrategyName } from '../utils/puzzleGenerator';
import { validateWord } from '../utils/wordValidator';
import { isRareWord, getRareWordMessage } from '../utils/scoring';
import { loadProgress, saveProgress } from '../utils/storage';

/**
 * Initialize a new game state
 */
function initializeGame(): GameState {
  const dateSeed = getTodayDateSeed();
  const strategyName = getActiveStrategyName();
  const puzzle = generatePuzzle(dateSeed);

  // Try to load saved progress for today and this strategy
  const savedProgress = loadProgress(dateSeed, strategyName);

  // Build initial order with center letter at index 3 (middle position)
  const centerIndex = puzzle.letters.indexOf(puzzle.centerLetter);
  const initialOrder = [0, 1, 2, 3, 4, 5, 6];

  // Swap center letter to middle position if not already there
  if (centerIndex !== 3) {
    [initialOrder[centerIndex], initialOrder[3]] = [initialOrder[3], initialOrder[centerIndex]];
  }

  return {
    puzzle,
    foundWords: savedProgress?.foundWords || [],
    currentWord: '',
    score: savedProgress?.score || 0,
    shuffledOrder: initialOrder,
    message: null,
  };
}

/**
 * Hook for managing the complete game state
 */
export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initializeGame());

  // Auto-save progress whenever foundWords or score changes
  useEffect(() => {
    if (gameState.foundWords.length > 0) {
      const dateSeed = getTodayDateSeed();
      const strategyName = getActiveStrategyName();
      saveProgress(dateSeed, strategyName, gameState.foundWords, gameState.score);
    }
  }, [gameState.foundWords, gameState.score]);

  /**
   * Add a letter to the current word
   */
  const addLetter = useCallback((letter: string) => {
    setGameState(prev => ({
      ...prev,
      currentWord: prev.currentWord + letter,
    }));
  }, []);

  /**
   * Remove the last letter from current word
   */
  const removeLetter = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentWord: prev.currentWord.slice(0, -1),
    }));
  }, []);

  /**
   * Clear the current word
   */
  const clearWord = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentWord: '',
    }));
  }, []);

  /**
   * Shuffle the letter display order (keeping center letter at position 3)
   */
  const shuffleLetters = useCallback(() => {
    setGameState(prev => {
      // Extract center letter (at index 3) and outer letters
      const centerValue = prev.shuffledOrder[3];
      const outerIndices = [0, 1, 2, 4, 5, 6];
      const outerValues = outerIndices.map(i => prev.shuffledOrder[i]);

      // Fisher-Yates shuffle the outer letters only
      for (let i = outerValues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [outerValues[i], outerValues[j]] = [outerValues[j], outerValues[i]];
      }

      // Rebuild the order with center fixed at position 3
      const newOrder = [
        outerValues[0],
        outerValues[1],
        outerValues[2],
        centerValue,
        outerValues[3],
        outerValues[4],
        outerValues[5],
      ];

      return {
        ...prev,
        shuffledOrder: newOrder,
      };
    });
  }, []);

  /**
   * Show a message to the user
   */
  const showMessage = useCallback((type: MessageType, text: string) => {
    const message: Message = {
      type,
      text,
      timestamp: Date.now(),
    };
    setGameState(prev => ({ ...prev, message }));

    // Auto-clear message after 2 seconds for errors, 3 seconds for success
    const timeout = type === 'error' ? 2000 : 3000;
    setTimeout(() => {
      setGameState(prev => {
        // Only clear if it's still the same message
        if (prev.message?.timestamp === message.timestamp) {
          return { ...prev, message: null };
        }
        return prev;
      });
    }, timeout);
  }, []);

  /**
   * Submit the current word
   */
  const submitWord = useCallback(() => {
    const word = gameState.currentWord.toLowerCase().trim();

    if (!word) return;

    const validation = validateWord(
      word,
      gameState.puzzle,
      gameState.foundWords
    );

    if (!validation.valid) {
      showMessage('error', validation.reason || 'Invalid word');
      // Clear the current word on error
      setGameState(prev => ({ ...prev, currentWord: '' }));
      return;
    }

    // Valid word! Calculate score and update state
    const wordScore = gameState.puzzle.wordScores.get(word);
    if (!wordScore) {
      showMessage('error', 'Word not found in puzzle');
      return;
    }

    setGameState(prev => ({
      ...prev,
      foundWords: [...prev.foundWords, word],
      currentWord: '',
      score: prev.score + wordScore.totalScore,
    }));

    // Show appropriate success message
    if (wordScore.isPangram) {
      showMessage('pangram', getRareWordMessage(wordScore.rarityDecile, true));
    } else if (isRareWord(wordScore.rarityDecile)) {
      showMessage('rare', getRareWordMessage(wordScore.rarityDecile, false));
    } else {
      showMessage('success', `+${wordScore.totalScore} points!`);
    }
  }, [gameState.currentWord, gameState.puzzle, gameState.foundWords, showMessage]);

  /**
   * Reset the game progress (for testing)
   */
  const resetProgress = useCallback(() => {
    const strategyName = getActiveStrategyName();
    localStorage.removeItem(`killerbee-progress-${strategyName}`);
    setGameState(initializeGame());
    showMessage('success', 'Progress reset!');
  }, [showMessage]);

  return {
    gameState,
    addLetter,
    removeLetter,
    clearWord,
    shuffleLetters,
    submitWord,
    resetProgress,
  };
}

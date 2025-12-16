# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Killer Bee** (also referred to as WordHive in code) is a retro/pixel art Spelling Bee clone with rarity-based scoring. It's a daily word puzzle game where players form words using 7 letters, with one required center letter.

## Development Commands

```bash
# Start development server (localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Process/regenerate word data files
npm run process-words
```

## Core Architecture

### Game Flow & State Management

The game uses a **React hooks-based architecture** with centralized state management through `useGameState` hook (`src/hooks/useGameState.ts`). This hook manages:
- Current puzzle state
- Found words & scoring
- Letter shuffling
- Message/feedback display
- Auto-save/load progress from localStorage

### Puzzle Generation System

**Strategy Pattern Architecture** (`src/utils/puzzleGenerator.ts` + `src/utils/strategies/`):

The puzzle generation system uses a **strategy pattern** to support multiple generation methods. Each strategy implements the `PuzzleStrategy` interface and defines:
1. How to generate letter sets (7 letters + 1 required center letter)
2. How to find valid words from those letters

**Available Strategies**:

#### 1. Curated Sets Strategy (default)
**File**: `src/utils/strategies/CuratedSetsStrategy.ts`

How it works:
- **Generates 7 random letters** with constraints:
  - No duplicate letters
  - At least one vowel guaranteed
  - Prefers vowels as center letter (70% probability) for better word formation
- Filters word list by puzzle letters + center letter requirement (4+ chars)
- Sorts by frequency and takes **top 100 most common words**
- **Auto-expands word variants**: Immediately after each base word, includes valid variants (plurals, -ed, -ing, -er, -est, -ly) so they get similar rarity scores
- Word count varies by letter combination (typically 50-150 words after expansion)

**Switching Strategies**:

For **local testing**, add URL parameter:
```
http://localhost:5173/?strategy=curated
```

For **deployment**, set environment variable in `.env`:
```
VITE_PUZZLE_STRATEGY=curated
```

Priority: URL parameter > Environment variable > Default (curated)

**Daily Deterministic Puzzles**:
- Uses `seedrandom` with YYYY-MM-DD date seed for reproducibility
- Same date always produces same puzzle (across all users)
- Calculates all scoring up-front

### Scoring System

**Three-component scoring** (`src/utils/scoring.ts`):

1. **Base Score**: 1 point for 4-letter words, length for 5+ letters
2. **Rarity Bonus**: 0-10 points based on word frequency decile within the puzzle
   - Decile calculated from word's position in puzzle's frequency-sorted list
   - Decile 1 (most common) = 0 bonus, Decile 10 (rarest) = 10 bonus
3. **Pangram Bonus**: +10 points if word uses all 7 letters

**Rarity Messages**:
- Decile 8+ shows special congratulations (Nice! ✨, Excellent! ⭐, Amazing! 🌟)
- Pangrams always show "PANGRAM! 🎉"

### Word Data Pipeline

**Two-stage data system**:

1. **Script Stage** (`scripts/processWordData.ts`):
   - Curated word list with approximate frequency data (prototype uses ~700 sample words)
   - Generates `src/data/words.json` (array of words)
   - Generates `src/data/wordFrequency.json` (word → frequency rank map)
   - Run with: `npm run process-words`

2. **Runtime Stage** (`src/utils/puzzleGenerator.ts`):
   - Imports static JSON data
   - Filters by puzzle letters & center letter requirement
   - Sorts by frequency and takes top 100
   - Expands with word variants (plurals, -ed, -ing, etc.)

### Component Structure

**Atomic components** in `src/components/`:
- `LetterTile.tsx` - Individual clickable letter buttons
- `LetterRow.tsx` - Arranges tiles (6 outer + 1 center)
- `CurrentWord.tsx` - Display typed word with backspace/clear
- `ShuffleButton.tsx` - Circular arrows icon to shuffle letters
- `FoundWords.tsx` - Scrollable list of discovered words
- `ScorePanel.tsx` - Current score / max possible score
- `Message.tsx` - Temporary feedback (success/error/rare/pangram)
- `HelpModal.tsx` - Game instructions overlay

**Main App** (`src/App.tsx`):
- Integrates all components
- Keyboard event handling (letters, Enter, Backspace, Space to shuffle)
- Calls `useGameState` hook for state management

### Storage & Persistence

**localStorage Integration** (`src/utils/storage.ts`):
- Key format: `killerbee-progress` (single key stores all progress)
- Stores: `{ dateSeed, foundWords[], score }`
- Auto-saves on every word found
- Auto-loads on game initialization
- Reset button clears localStorage for testing

## Technology Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **seedrandom** for deterministic puzzle generation
- **Vanilla CSS** with retro/pixel art aesthetic (separate CSS file per component)

## Important Notes

1. **Word list size**: Currently 100 words per puzzle (intentionally limited for reasonable difficulty)
2. **Variant expansion**: Word variants (plurals, tenses) are added immediately after base words in the sorted list, ensuring they get adjacent positions and similar rarity scores
3. **Date-based seeding**: Uses local timezone date (YYYY-MM-DD) for daily puzzles
4. **Frequency data**: Currently uses prototype data; production would use SUBTLEX or similar corpus
5. **Letter sets**: 10 curated sets chosen for good word coverage (high-frequency letters like E, A, R, S, T, N)

## Testing Workflow

To test different puzzles:
1. Change date in `getTodayDateSeed()` or pass different seed to `generatePuzzle()`
2. Click "Reset Progress" button to clear localStorage
3. Reload page for fresh puzzle state

To modify word list:
1. Edit `scripts/processWordData.ts`
2. Run `npm run process-words`
3. Rebuild/reload dev server

## Creating New Puzzle Strategies

To add a new puzzle generation method:

**1. Create strategy file** in `src/utils/strategies/`:
```typescript
// src/utils/strategies/MyNewStrategy.ts
import type { PuzzleStrategy } from './PuzzleStrategy';
import wordList from '../../data/words.json';
import wordFrequency from '../../data/wordFrequency.json';

export class MyNewStrategy implements PuzzleStrategy {
  readonly name = 'mynew';
  readonly description = 'Brief description of your strategy';

  generateLetterSet(rng: () => number): { letters: string[]; center: string } {
    // Your logic to generate 7 letters and pick a center letter
    // Use rng() for any randomness to ensure determinism
    return { letters: [...], center: '...' };
  }

  findValidWords(letters: string[], centerLetter: string): string[] {
    // Your logic to find valid words
    // Should return words sorted by desired difficulty
    return [...];
  }
}
```

**2. Register in `puzzleGenerator.ts`**:
```typescript
import { MyNewStrategy } from './strategies/MyNewStrategy';

// In getActiveStrategy():
switch (strategyName) {
  case 'curated':
    return new CuratedSetsStrategy();
  case 'mynew':
    return new MyNewStrategy();
  // ...
}
```

**3. Update `.env.example`**:
```
# Available strategies: curated, mynew
VITE_PUZZLE_STRATEGY=curated
```

**4. Test locally**:
```
http://localhost:5173/?strategy=mynew
```

**Key Requirements**:
- Must implement `PuzzleStrategy` interface
- Use the provided `rng()` function for any randomness (ensures same-date reproducibility)
- Return words in desired difficulty order (typically frequency-sorted)
- Keep strategies self-contained (each has its own word filtering logic)

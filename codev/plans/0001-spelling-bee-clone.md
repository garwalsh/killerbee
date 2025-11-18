# Plan: Spelling Bee Clone - "WordHive"

## Metadata
- **ID**: 0001-spelling-bee-clone
- **Status**: draft
- **Specification**: [codev/specs/0001-spelling-bee-clone.md](../specs/0001-spelling-bee-clone.md)
- **Created**: 2025-11-17
- **Protocol**: SPIDER-SOLO

## Executive Summary

This plan implements a retro/pixel art Spelling Bee clone as a client-side React + TypeScript application. Following the specification's Approach 1 (Client-Only React App with Embedded Word Data), we'll build a fully browser-based game with no backend dependencies.

The implementation is broken into 6 phases:
1. Project setup and word data preparation
2. Core game state and logic
3. UI components and layout
4. Daily puzzle and persistence
5. Scoring system with rarity
6. Polish and testing

This approach prioritizes getting a playable prototype quickly while maintaining code quality and testability.

## Success Metrics

From specification:
- [ ] Game displays 7 letters in a linear arrangement
- [ ] Center letter is visually distinct
- [ ] Players can form words by clicking letters
- [ ] Spacebar and button shuffle letters
- [ ] Only words using center letter are accepted
- [ ] Words must be at least 4 letters long
- [ ] Game validates words against word list
- [ ] Scoring: base + rarity + pangram bonus implemented correctly
- [ ] Progress indicators show total words and max score
- [ ] Rare word congratulations message appears
- [ ] Found words list displayed
- [ ] Daily puzzle consistent for all players
- [ ] Puzzle resets at midnight
- [ ] Responsive design (mobile + desktop)
- [ ] Retro/pixel art aesthetic

Implementation-specific:
- [ ] Test coverage >80% (adjusted for prototype)
- [ ] All TypeScript strict mode enabled
- [ ] Zero console errors or warnings
- [ ] Bundle size <2MB
- [ ] Lighthouse performance score >80

## Phase Breakdown

### Phase 1: Project Setup and Word Data Preparation
**Dependencies**: None
**Status**: pending

#### Objectives
- Create React + TypeScript project with build tooling
- Source and process word list data
- Source and process word frequency data
- Generate consolidated word data JSON files

#### Deliverables
- [ ] React + TypeScript project initialized (using Vite)
- [ ] Word list sourced (SCOWL or enable word list, 4+ letters only)
- [ ] Word frequency data sourced (SUBTLEX or combined source)
- [ ] Script to merge word list + frequency into ranked JSON
- [ ] `src/data/words.json` - filtered word list
- [ ] `src/data/wordFrequency.json` - word to frequency rank mapping
- [ ] Basic project structure (components/, utils/, types/)
- [ ] Tests for data processing scripts

#### Implementation Details

**Project Structure**:
```
src/
  components/         # React components
  utils/             # Helper functions
  types/             # TypeScript type definitions
  data/              # Word list and frequency data
  hooks/             # Custom React hooks
  styles/            # CSS files
  App.tsx
  main.tsx
scripts/
  processWordData.ts # Data preparation script
public/
tests/
```

**Key Files**:
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript strict mode configuration
- `scripts/processWordData.ts` - Downloads/processes word data

**Data Processing**:
1. Download SCOWL word list (or enable word list)
2. Filter to 4+ letter words only
3. Download SUBTLEX frequency data
4. Merge: create mapping of word → frequency rank
5. Export as JSON files in `src/data/`

#### Acceptance Criteria
- [ ] `npm run dev` starts development server
- [ ] TypeScript compiles with no errors (strict mode)
- [ ] `src/data/words.json` contains 20,000+ valid words
- [ ] `src/data/wordFrequency.json` has frequency data for all words
- [ ] Data processing script is documented and reproducible
- [ ] ESLint and Prettier configured

#### Test Plan
- **Unit Tests**: Data processing functions (filtering, merging)
- **Integration Tests**: None needed for this phase
- **Manual Testing**: Verify word data looks correct, run dev server

#### Rollback Strategy
Delete project and restart. No risk since this is phase 1.

#### Risks
- **Risk**: Word list quality issues (offensive words, poor coverage)
  - **Mitigation**: Use established word lists (SCOWL, enable), manual spot-checking
- **Risk**: Frequency data doesn't align with word list
  - **Mitigation**: Use fallback frequency assignment for missing words

---

### Phase 2: Core Game State and Logic
**Dependencies**: Phase 1
**Status**: pending

#### Objectives
- Implement core game logic (word validation, scoring)
- Create TypeScript types for game state
- Build puzzle generation algorithm
- Implement word validation without UI

#### Deliverables
- [ ] `src/types/game.ts` - TypeScript interfaces for game state
- [ ] `src/utils/puzzleGenerator.ts` - Daily puzzle generation
- [ ] `src/utils/wordValidator.ts` - Word validation logic
- [ ] `src/utils/scoring.ts` - Scoring calculation (base + rarity + pangram)
- [ ] `src/hooks/useGameState.ts` - React hook for game state management
- [ ] Comprehensive unit tests for all game logic

#### Implementation Details

**TypeScript Types** (`src/types/game.ts`):
```typescript
interface Puzzle {
  letters: string[];        // All 7 letters
  centerLetter: string;     // The required letter
  validWords: Set<string>;  // All possible words
  wordScores: Map<string, WordScore>; // Word → score breakdown
  maxScore: number;         // Sum of all possible points
}

interface WordScore {
  word: string;
  baseScore: number;
  rarityBonus: number;
  isPangram: boolean;
  pangramBonus: number;
  totalScore: number;
  rarityDecile: number;  // 1-10
}

interface GameState {
  puzzle: Puzzle;
  foundWords: string[];
  currentWord: string;
  score: number;
  shuffledOrder: number[]; // Indices for letter display order
}
```

**Puzzle Generation** (`src/utils/puzzleGenerator.ts`):
- Use date-based seeding (seedrandom library)
- Select 7 letters that form at least 20 valid words
- Ensure at least one pangram exists
- Return Puzzle object with pre-calculated valid words and scores

**Word Validation** (`src/utils/wordValidator.ts`):
- Check word length >= 4
- Check center letter is used
- Check all letters are from puzzle letters
- Check word exists in word list
- Return validation result

**Scoring** (`src/utils/scoring.ts`):
- Calculate base score (1 for 4-letter, length for 5+)
- Determine rarity decile from frequency data
- Add rarity bonus (0-10)
- Add pangram bonus (+10 if uses all 7 letters)
- Return WordScore object

#### Acceptance Criteria
- [ ] Puzzle generator creates valid puzzles deterministically
- [ ] Same date produces same puzzle across runs
- [ ] Word validator correctly accepts/rejects words
- [ ] Scoring correctly calculates base + rarity + pangram
- [ ] All TypeScript types are properly defined
- [ ] All functions have JSDoc comments
- [ ] Test coverage >90% for this phase

#### Test Plan
- **Unit Tests**:
  - Puzzle generation with various seeds
  - Word validation (valid, invalid, edge cases)
  - Scoring calculation (all combinations)
  - Rarity decile assignment
  - Pangram detection
- **Integration Tests**: Full game state flow (start → submit words → score)
- **Manual Testing**: Generate puzzles for different dates, verify consistency

#### Rollback Strategy
Revert commits for this phase. Phase 1 remains intact.

#### Risks
- **Risk**: Puzzle generation produces unsolvable/boring puzzles
  - **Mitigation**: Add validation rules (min words, letter distribution, at least 1 pangram)
- **Risk**: Performance issues with large word list lookups
  - **Mitigation**: Use Set/Map for O(1) lookups, pre-filter valid words per puzzle

---

### Phase 3: UI Components and Layout
**Dependencies**: Phase 2
**Status**: pending

#### Objectives
- Build React components for game UI
- Implement retro/pixel art styling
- Create responsive layout
- Wire up game state to UI (no persistence yet)

#### Deliverables
- [ ] `src/components/LetterTile.tsx` - Individual letter button
- [ ] `src/components/LetterRow.tsx` - Row of 7 letters
- [ ] `src/components/CurrentWord.tsx` - Display current typed word
- [ ] `src/components/FoundWords.tsx` - List of found words
- [ ] `src/components/ScorePanel.tsx` - Score and progress indicators
- [ ] `src/components/ShuffleButton.tsx` - Shuffle control
- [ ] `src/components/Message.tsx` - Feedback messages (errors, congrats)
- [ ] `src/App.tsx` - Main game layout
- [ ] `src/styles/` - CSS files with pixel art theme
- [ ] Responsive CSS for mobile + desktop

#### Implementation Details

**Component Hierarchy**:
```
App
├── ScorePanel (score, progress, max score)
├── CurrentWord (display typed word)
├── LetterRow
│   └── LetterTile × 7 (clickable letters)
├── ShuffleButton
├── FoundWords (list of found words)
└── Message (ephemeral feedback)
```

**Styling Approach**:
- Use pixel art font (e.g., "Press Start 2P" from Google Fonts)
- Retro color palette (limited colors, high contrast)
- CSS Grid/Flexbox for responsive layout
- CSS modules or styled-components for component styles
- Mobile-first responsive design

**Key Interactions**:
- Click letter → add to current word
- Click shuffle button OR press spacebar → shuffle letter order
- Press enter OR submit button → validate word
- Press backspace/delete → remove last letter
- Click current word letter → remove from that position

**Center Letter Styling**:
- Different background color
- Possible border/glow effect
- Remains visually distinct after shuffle

#### Acceptance Criteria
- [ ] All components render without errors
- [ ] Letter tiles are clickable and responsive
- [ ] Shuffle works (button and spacebar)
- [ ] Current word updates as letters clicked
- [ ] Found words list displays correctly
- [ ] Score panel shows current score
- [ ] Responsive on mobile (375px) and desktop (1920px)
- [ ] Retro/pixel art aesthetic is consistent
- [ ] All interactions have visual feedback
- [ ] Keyboard navigation works

#### Test Plan
- **Unit Tests**: Component rendering, prop handling
- **Integration Tests**: User interactions (click letters, shuffle, submit)
- **Manual Testing**:
  - Test on mobile device (or DevTools mobile view)
  - Test keyboard controls
  - Test touch events on mobile
  - Verify pixel art font loads
  - Check color contrast/accessibility

#### Rollback Strategy
Revert commits. Game logic from Phase 2 remains functional.

#### Risks
- **Risk**: Pixel art design looks amateurish
  - **Mitigation**: Use established pixel fonts, reference retro game designs
- **Risk**: Mobile touch targets too small
  - **Mitigation**: Minimum 44px touch targets, test on real devices
- **Risk**: Font loading issues
  - **Mitigation**: Use font-display: swap, include fallback fonts

---

### Phase 4: Daily Puzzle and Persistence
**Dependencies**: Phase 3
**Status**: pending

#### Objectives
- Implement daily puzzle logic with date-based generation
- Add localStorage persistence for daily progress
- Handle midnight reset
- Prevent playing future puzzles

#### Deliverables
- [ ] `src/utils/dateUtils.ts` - Date handling utilities
- [ ] `src/utils/storage.ts` - localStorage wrapper
- [ ] `src/hooks/useDailyPuzzle.ts` - Hook for daily puzzle + persistence
- [ ] Midnight reset detection
- [ ] Save/load progress for current day
- [ ] Clear old puzzle data after midnight

#### Implementation Details

**Date Handling** (`src/utils/dateUtils.ts`):
```typescript
function getTodayKey(): string {
  // Returns "YYYY-MM-DD" in local timezone
}

function getDateSeed(dateKey: string): number {
  // Converts date string to deterministic seed
}

function isNewDay(lastPlayedDate: string): boolean {
  // Checks if current date is different from last played
}
```

**localStorage Schema**:
```typescript
interface SavedProgress {
  date: string;           // "YYYY-MM-DD"
  foundWords: string[];
  score: number;
  lastPlayed: number;     // Unix timestamp
}
```

**Daily Puzzle Hook** (`src/hooks/useDailyPuzzle.ts`):
- On mount: Check localStorage for today's date
- If today's progress exists: load it
- If new day: clear old data, generate new puzzle
- Auto-save progress after each word found
- Return puzzle, progress, and reset function

**Midnight Reset**:
- Use `setInterval` to check date change
- When date changes: trigger puzzle regeneration
- Show "New puzzle available!" message

#### Acceptance Criteria
- [ ] Same puzzle loads for same day across page refreshes
- [ ] Progress persists after page reload
- [ ] New puzzle generated at midnight
- [ ] Old puzzle data cleared when new day starts
- [ ] Cannot access future puzzles
- [ ] localStorage data is valid JSON
- [ ] Handles localStorage quota exceeded gracefully

#### Test Plan
- **Unit Tests**:
  - Date utilities (getTodayKey, seed generation)
  - localStorage save/load
  - Date change detection
- **Integration Tests**:
  - Play game, refresh page, verify progress restored
  - Mock date change, verify new puzzle loads
- **Manual Testing**:
  - Play game, close tab, reopen, verify progress
  - Test around midnight (or mock system time)
  - Clear localStorage, verify fresh start

#### Rollback Strategy
Revert commits. Game still playable, just no persistence.

#### Risks
- **Risk**: Timezone issues (users in different timezones get different puzzles)
  - **Mitigation**: Use local timezone consistently (document this as expected behavior)
- **Risk**: localStorage unavailable (private browsing)
  - **Mitigation**: Detect and fallback to in-memory state (warn user)
- **Risk**: Corrupted localStorage data
  - **Mitigation**: Try/catch JSON parsing, reset to default if invalid

---

### Phase 5: Scoring System with Rarity
**Dependencies**: Phase 4
**Status**: pending

#### Objectives
- Implement rarity-based scoring
- Add progress indicators (X/Y words, score/max score)
- Show ephemeral congratulations for rare words
- Calculate max possible score for puzzle

#### Deliverables
- [ ] Rarity decile calculation integrated into scoring
- [ ] Progress indicators in ScorePanel
- [ ] `src/components/CongratulationsMessage.tsx` - Ephemeral message component
- [ ] Trigger congrats message for rare words (decile 8-10)
- [ ] Calculate and display max possible score
- [ ] Update ScorePanel to show "X / Y words found" and "Score / Max Score"

#### Implementation Details

**Rarity Calculation**:
- When generating puzzle, rank all valid words by frequency
- Split into 10 deciles
- Assign each word a decile number (1=common, 10=rare)
- Store in wordScores map

**Progress Indicators**:
- Total words: `puzzle.validWords.size`
- Found words: `foundWords.length`
- Current score: sum of found word scores
- Max score: `puzzle.maxScore` (pre-calculated)

**Congratulations Message**:
- Trigger when word with decile >= 8 is found
- Show for 3 seconds, then fade out
- Messages: "Nice!" (decile 8), "Excellent!" (decile 9), "Amazing!" (decile 10)
- Position: centered or near score area
- Style: retro/pixel art consistent

**Max Score Calculation**:
- Sum all word scores in puzzle.wordScores
- Calculate during puzzle generation
- Store in Puzzle object

#### Acceptance Criteria
- [ ] Rare words score correctly (base + rarity bonus)
- [ ] Pangrams score correctly (base + rarity + 10)
- [ ] Progress shows "X / Y words" accurately
- [ ] Max score displayed correctly
- [ ] Congrats message appears for rare words
- [ ] Message disappears after timeout
- [ ] Multiple congrats messages don't overlap weirdly
- [ ] Scoring is deterministic and testable

#### Test Plan
- **Unit Tests**:
  - Decile calculation
  - Score calculation for various words
  - Max score calculation
- **Integration Tests**:
  - Submit rare word, verify congrats appears
  - Verify progress updates correctly
- **Manual Testing**:
  - Find rare words, check message appears
  - Find pangram, verify +10 bonus
  - Compare displayed max score to calculation

#### Rollback Strategy
Revert commits. Basic scoring still works, just no rarity bonus.

#### Risks
- **Risk**: Frequency data quality issues (all words same frequency)
  - **Mitigation**: Validate frequency data distribution, spot-check deciles
- **Risk**: Congrats message annoying or too frequent
  - **Mitigation**: Only trigger for decile 8-10 (top 30%), configurable threshold

---

### Phase 6: Polish, Testing, and Deployment Prep
**Dependencies**: Phase 5
**Status**: pending

#### Objectives
- Add animations and polish
- Comprehensive testing
- Performance optimization
- Prepare for deployment
- Documentation

#### Deliverables
- [ ] Animations for word submission (success/error)
- [ ] Letter tile hover/active states
- [ ] Smooth shuffle animation
- [ ] Loading state for initial puzzle generation
- [ ] Error handling for all edge cases
- [ ] Accessibility improvements (ARIA labels, keyboard nav)
- [ ] Performance optimization (code splitting, lazy loading)
- [ ] README.md with setup instructions
- [ ] Deployment configuration (Vercel/Netlify)
- [ ] All tests passing with >80% coverage

#### Implementation Details

**Animations**:
- Letter tiles: hover scale, active press effect
- Shuffle: stagger animation for letters repositioning
- Word submission: success (green flash) / error (red shake)
- Congrats message: fade in/out
- Score increment: animated number counter

**Error Handling**:
- Invalid word: show error message, shake current word
- Already found: show "Already found!" message
- Too short: show "Too short!" message
- Missing center letter: show "Must use center letter!"
- All errors clear after 2 seconds

**Accessibility**:
- ARIA labels for all interactive elements
- Keyboard navigation (tab through letters, enter to submit)
- Screen reader announcements for score changes
- Sufficient color contrast (WCAG AA)
- Focus indicators

**Performance**:
- Code splitting (lazy load found words list if long)
- Memoize expensive computations (React.memo, useMemo)
- Optimize word validation (use Set for O(1) lookup)
- Bundle analysis (remove unused dependencies)

**Documentation**:
- README: project description, setup, development, deployment
- Code comments for complex logic
- Type documentation (JSDoc for public functions)

**Deployment**:
- Configure build for production
- Set up Vercel or Netlify
- Test deployed version
- Add custom domain (optional)

#### Acceptance Criteria
- [ ] All animations smooth (60fps)
- [ ] No console errors or warnings
- [ ] Lighthouse scores: Performance >80, Accessibility >90
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Works on iOS Safari and Android Chrome
- [ ] All edge cases handled gracefully
- [ ] Test coverage >80%
- [ ] README is complete and accurate
- [ ] Deployed version is accessible

#### Test Plan
- **Unit Tests**: All utility functions, hooks
- **Integration Tests**: Full game flows, error scenarios
- **E2E Tests** (optional): Playwright/Cypress for critical paths
- **Manual Testing**:
  - Full playthrough on desktop
  - Full playthrough on mobile
  - Test all error conditions
  - Test accessibility with keyboard only
  - Test in all supported browsers
  - Performance testing (Lighthouse)

#### Rollback Strategy
Revert polish commits if they introduce bugs. Core game remains functional.

#### Risks
- **Risk**: Animations cause performance issues on low-end devices
  - **Mitigation**: Use CSS transforms (GPU-accelerated), test on low-end device, provide reduced motion option
- **Risk**: Deployment issues (env variables, build errors)
  - **Mitigation**: Test build locally, review deployment docs
- **Risk**: Browser compatibility issues
  - **Mitigation**: Use Babel/PostCSS for polyfills, test in all browsers

---

## Dependency Map
```
Phase 1 (Setup + Data)
    ↓
Phase 2 (Game Logic)
    ↓
Phase 3 (UI Components)
    ↓
Phase 4 (Daily Puzzle + Persistence)
    ↓
Phase 5 (Rarity Scoring)
    ↓
Phase 6 (Polish + Testing)
```

## Resource Requirements

### Development Resources
- **Developer**: 1 full-stack developer (TypeScript, React, game logic)
- **Environment**: Node.js 18+, modern browser, code editor

### Infrastructure
- Static file hosting (Vercel, Netlify, GitHub Pages)
- No database required
- No backend services required
- CDN for static assets (provided by hosting)

## Integration Points

### External Systems
- **Google Fonts**: For pixel art font (Press Start 2P or similar)
  - **Integration Type**: CDN link
  - **Phase**: Phase 3
  - **Fallback**: System font stack if CDN unavailable

### Internal Systems
None - fully self-contained client-side app

## Risk Analysis

### Technical Risks
| Risk | Probability | Impact | Mitigation | Phase |
|------|------------|--------|------------|-------|
| Word list quality issues | Medium | Medium | Use established lists, manual review | Phase 1 |
| Frequency data misalignment | Low | Medium | Fallback frequency for missing words | Phase 1 |
| Puzzle generation produces boring puzzles | Medium | High | Add validation rules, manual testing | Phase 2 |
| Performance issues with large word sets | Low | Medium | Use Set/Map, optimize lookups | Phase 2 |
| Mobile touch target accessibility | Medium | Medium | Min 44px targets, real device testing | Phase 3 |
| localStorage unavailable | Low | Low | Fallback to in-memory state | Phase 4 |
| Timezone issues for daily puzzle | Medium | Low | Document local timezone behavior | Phase 4 |
| Animation performance on low-end devices | Low | Medium | Use GPU transforms, reduced motion | Phase 6 |

### Schedule Risks
| Risk | Probability | Impact | Mitigation | Phase |
|------|------------|--------|------------|-------|
| Data sourcing takes longer than expected | Low | Low | Allocate buffer time in Phase 1 | Phase 1 |
| Scoring logic complexity | Low | Medium | Write tests first, iterate | Phase 2 |
| UI design iteration | Medium | Low | Start with minimal viable design | Phase 3 |

## Validation Checkpoints

1. **After Phase 1**: Verify word data is complete and correct
2. **After Phase 2**: Test game logic thoroughly (unit tests >90% coverage)
3. **After Phase 3**: Playtest UI on mobile and desktop
4. **After Phase 4**: Test persistence and daily puzzle across multiple days
5. **After Phase 5**: Verify scoring is accurate and progress indicators work
6. **Before Deployment**: Full regression testing, browser compatibility, performance

## Monitoring and Observability

Not applicable for client-side prototype. Future enhancements could add:
- Analytics (user engagement, words found distribution)
- Error tracking (Sentry)
- Performance monitoring (Web Vitals)

## Documentation Updates Required

- [ ] README.md (how to run, develop, deploy)
- [ ] CONTRIBUTING.md (if open source)
- [ ] Inline code comments (JSDoc for functions)
- [ ] Type documentation (TypeScript interfaces)

## Post-Implementation Tasks

- [ ] Performance validation (Lighthouse)
- [ ] Accessibility audit (aXe, manual keyboard testing)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS Safari, Android Chrome)
- [ ] User acceptance testing (playtest with friends/family)
- [ ] Security review (XSS, localStorage safety)

## Expert Review

**Note**: This plan was created using SPIDER-SOLO protocol (single-agent workflow). Multi-agent consultation with GPT-5 and Gemini Pro was not performed due to Zen MCP server unavailability.

## Approval

- [ ] Technical Lead Review (User)
- [ ] Resource Allocation Confirmed

## Change Log

| Date | Change | Reason | Author |
|------|--------|--------|--------|
| 2025-11-17 | Initial plan created | Specification approved | Claude |

## Notes

### Technology Choices

**Vite vs Create React App**:
- Choosing Vite for faster dev server and better build performance
- Modern defaults (ES modules, fast HMR)

**Word List Choice**:
- SCOWL (Spell Checker Oriented Word Lists) or enable word list
- Both are public domain and comprehensive
- Will filter to 4+ letters and remove offensive words

**Frequency Data**:
- SUBTLEX-US (subtitle-based frequency) or combined source
- More representative of actual usage than book-based corpora

**Styling**:
- CSS Modules for component-scoped styles
- Google Fonts for pixel art font
- CSS Grid + Flexbox for layout

### Open Implementation Questions

1. **Rare word threshold**: Use decile 8+ for congratulations messages (can adjust based on playtesting)
2. **Found words sorting**: Default to time found (newest first), can add sort options later
3. **Animations**: Keep minimal for prototype, enhance based on feedback

### Future Enhancements (Out of Scope for Prototype)

- User accounts and cross-device sync
- Puzzle archive (play past days)
- Hints system
- Social sharing (share score on social media)
- Leaderboards
- Word definitions
- Sound effects and music
- Achievements/badges
- Multiple difficulty levels
- Customizable themes

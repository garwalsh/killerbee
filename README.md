# Killer Bee 🐝

A challenging word puzzle game for seasoned puzzlers. Built as a more difficult alternative to NYT Spelling Bee, with rarity-based scoring that rewards finding uncommon words.

**Play now:** [killerbee-pi.vercel.app](https://killerbee-pi.vercel.app/)

## Why Killer Bee?

NYT Spelling Bee is fun, but has some limitations:
- **Too easy** - Excludes many legitimate "hard" words
- **Flat scoring** - All words worth the same base points regardless of rarity
- **Limited challenge** - Seasoned solvers want more depth

**Killer Bee fixes this:**
- ✅ Includes challenging, uncommon words
- ✅ **Rarity-based scoring** - Rare words earn significantly more points
- ✅ More strategic gameplay - Should you hunt for rare words or rack up common ones?
- ✅ Targets experienced word puzzle enthusiasts

## Game Rules

- Create words using the 7 letters provided
- Words must be **at least 4 letters long**
- Words must include the **center letter** (highlighted)
- Letters can be reused multiple times
- Find the **pangram** (uses all 7 letters) for a huge bonus!

## Scoring System

**Base Score:**
- 4-letter words: 1 point
- 5+ letter words: 1 point per letter

**Rarity Bonus:**
- Common words: +0-3 points
- Uncommon words: +5-7 points
- Rare words: +10 points ⭐

**Pangram Bonus:**
- Using all 7 letters: +10 points 🎉

**Example:**
- "TURN" (common 4-letter) = 1 + 1 = **2 points**
- "DUGONG" (rare 6-letter) = 6 + 10 = **16 points**
- "GROUNDOUT" (rare pangram) = 9 + 10 + 10 = **29 points**

Finding rare words is highly rewarded!

## Features

- 📅 **Daily puzzles** - New puzzle every day
- 💾 **Auto-save** - Progress saved automatically
- ⌨️ **Keyboard support** - Type or click letters
- 🎨 **Retro pixel art aesthetic** - Press Start 2P font
- 🎯 **Two puzzle modes**:
  - **Curated**: Random letter combinations with frequency-based scoring
  - **Historic**: Real NYT Spelling Bee puzzles with position-based difficulty

## Keyboard Shortcuts

- **Type letters** - Add to current word
- **ENTER** - Submit word
- **BACKSPACE** - Remove last letter
- **ESC** - Clear current word
- **SPACE** - Shuffle outer letters

## Technology Stack

- **React 19** with TypeScript
- **Vite** for blazing fast builds
- **Vanilla CSS** with retro styling
- **Vercel** for deployment
- **Strategy Pattern** for extensible puzzle generation

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture Highlights

### Strategy Pattern for Puzzles
The game uses a pluggable strategy pattern for puzzle generation:

```typescript
interface PuzzleStrategy {
  name: string;
  generateLetterSet(rng: () => number): { letters: string[]; center: string };
  findValidWords(letters: string[], centerLetter: string): string[];
}
```

This makes it easy to add new puzzle types or word selection algorithms.

### Deterministic Daily Puzzles
Uses `seedrandom` with date-based seeds to ensure:
- Same puzzle for all players on the same day
- Reproducible puzzles for testing
- Smooth progression of difficulty

### Smart Rarity Scoring
Two scoring methods:
1. **Frequency-based** (Curated mode) - Uses word frequency data from common English corpora
2. **Position-based** (Historic mode) - Preserves original NYT puzzle difficulty ordering

## Contributing

This game was built to challenge experienced word puzzle solvers. Ideas for improvement:

- Additional word lists (British English, technical terms, etc.)
- Difficulty settings
- Multiplayer/competitive modes
- Statistics and streak tracking
- Achievement system for finding all rare words

## License

MIT License - Feel free to fork and modify!

## Acknowledgments

- Inspired by NYT Spelling Bee
- Built for the puzzle community that wants more challenge
- Pixel art aesthetic from Press Start 2P font

---

**For seasoned puzzlers who want a real challenge.** 🐝

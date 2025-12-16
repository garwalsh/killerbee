/**
 * Script to convert puzzles file format to historicPuzzles.json
 *
 * Input format:
 * - First line: 7 letters (first letter is center)
 * - Following lines: word list
 * - Blank lines separate puzzles
 */

import * as fs from 'fs';
import * as path from 'path';

interface Puzzle {
  date: string;
  letters: string[];
  center: string;
  words: string[];
}

function parsePuzzlesFile(filePath: string): Puzzle[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').map(line => line.trim());

  const puzzles: Puzzle[] = [];
  let currentLetters: string | null = null;
  let currentWords: string[] = [];
  let puzzleIndex = 0;

  for (const line of lines) {
    // Skip empty lines
    if (!line) {
      // If we have accumulated a puzzle, save it
      if (currentLetters && currentWords.length > 0) {
        const letterChars = currentLetters.split('');
        const center = letterChars[0]; // First letter is center
        const allLetters = letterChars; // All 7 letters (already split)

        puzzles.push({
          date: `2024-12-${String(17 + puzzleIndex).padStart(2, '0')}`, // Sequential dates starting Dec 17
          letters: allLetters,
          center: center,
          words: currentWords,
        });

        puzzleIndex++;
        currentLetters = null;
        currentWords = [];
      }
      continue;
    }

    // Check if this is a letter line (7 letters, all lowercase, and we don't have letters yet)
    if (line.length === 7 && /^[a-z]+$/.test(line) && currentLetters === null) {
      currentLetters = line;
    } else if (currentLetters) {
      // This is a word in the current puzzle
      currentWords.push(line);
    }
  }

  // Don't forget the last puzzle if file doesn't end with blank lines
  if (currentLetters && currentWords.length > 0) {
    const letterChars = currentLetters.split('');
    const center = letterChars[0];
    const allLetters = letterChars;

    puzzles.push({
      date: `2024-12-${String(17 + puzzleIndex).padStart(2, '0')}`,
      letters: allLetters,
      center: center,
      words: currentWords,
    });
  }

  return puzzles;
}

function main() {
  const puzzlesPath = path.join(process.cwd(), 'puzzles');
  const outputPath = path.join(process.cwd(), 'src', 'data', 'historicPuzzles.json');

  console.log('Parsing puzzles file...');
  const puzzles = parsePuzzlesFile(puzzlesPath);

  console.log(`Found ${puzzles.length} puzzles\n`);

  // Display summary
  puzzles.forEach((puzzle, index) => {
    console.log(`Puzzle ${index + 1}:`);
    console.log(`  Date: ${puzzle.date}`);
    console.log(`  Letters: ${puzzle.letters.join('')} (center: ${puzzle.center})`);
    console.log(`  Words: ${puzzle.words.length}`);
    console.log();
  });

  // Create the output structure
  const output = {
    version: "1.0",
    source: "NYT Spelling Bee",
    description: "Historic Spelling Bee puzzles with pre-ordered word lists. Word order represents difficulty (first = rarest, last = most common).",
    puzzles: puzzles,
  };

  // Write to file
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`✓ Written to ${outputPath}`);
}

main();

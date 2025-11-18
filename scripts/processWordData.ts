import * as fs from 'fs';
import * as path from 'path';

/**
 * This script processes word list data for the WordHive game.
 * For the prototype, we'll use a curated subset of common English words.
 *
 * In production, this would:
 * 1. Download SCOWL or enable word list
 * 2. Download SUBTLEX frequency data
 * 3. Merge and process the data
 *
 * For now, we'll create a sample dataset for testing.
 */

interface WordFrequency {
  word: string;
  frequency: number; // Higher = more common
}

// Sample word list with approximate frequency ranks
// In production, this would come from SUBTLEX or similar
const sampleWords: WordFrequency[] = [
  // Very common words
  { word: 'about', frequency: 1000 },
  { word: 'after', frequency: 950 },
  { word: 'again', frequency: 900 },
  { word: 'also', frequency: 880 },
  { word: 'back', frequency: 860 },
  { word: 'because', frequency: 840 },
  { word: 'before', frequency: 820 },
  { word: 'being', frequency: 800 },
  { word: 'between', frequency: 780 },
  { word: 'both', frequency: 760 },
  { word: 'call', frequency: 740 },
  { word: 'came', frequency: 720 },
  { word: 'come', frequency: 700 },
  { word: 'could', frequency: 680 },
  { word: 'down', frequency: 660 },
  { word: 'each', frequency: 640 },
  { word: 'even', frequency: 620 },
  { word: 'every', frequency: 600 },
  { word: 'feel', frequency: 580 },
  { word: 'find', frequency: 560 },
  { word: 'first', frequency: 540 },
  { word: 'from', frequency: 520 },
  { word: 'give', frequency: 500 },
  { word: 'good', frequency: 480 },
  { word: 'great', frequency: 460 },
  { word: 'hand', frequency: 440 },
  { word: 'have', frequency: 420 },
  { word: 'help', frequency: 400 },
  { word: 'here', frequency: 380 },
  { word: 'high', frequency: 360 },
  { word: 'home', frequency: 340 },
  { word: 'into', frequency: 320 },
  { word: 'just', frequency: 300 },
  { word: 'keep', frequency: 280 },
  { word: 'know', frequency: 260 },
  { word: 'last', frequency: 240 },
  { word: 'leave', frequency: 220 },
  { word: 'life', frequency: 200 },
  { word: 'like', frequency: 180 },
  { word: 'line', frequency: 160 },
  { word: 'little', frequency: 140 },
  { word: 'long', frequency: 120 },
  { word: 'look', frequency: 100 },
  { word: 'made', frequency: 95 },
  { word: 'make', frequency: 90 },
  { word: 'many', frequency: 85 },
  { word: 'mean', frequency: 80 },
  { word: 'more', frequency: 75 },
  { word: 'most', frequency: 70 },
  { word: 'move', frequency: 65 },
  { word: 'much', frequency: 60 },
  { word: 'must', frequency: 55 },
  { word: 'name', frequency: 50 },
  { word: 'need', frequency: 48 },
  { word: 'never', frequency: 46 },
  { word: 'next', frequency: 44 },
  { word: 'number', frequency: 42 },
  { word: 'only', frequency: 40 },
  { word: 'other', frequency: 38 },
  { word: 'over', frequency: 36 },
  { word: 'part', frequency: 34 },
  { word: 'people', frequency: 32 },
  { word: 'place', frequency: 30 },
  { word: 'point', frequency: 28 },
  { word: 'right', frequency: 26 },
  { word: 'same', frequency: 24 },
  { word: 'school', frequency: 22 },
  { word: 'seem', frequency: 20 },
  { word: 'should', frequency: 19 },
  { word: 'show', frequency: 18 },
  { word: 'small', frequency: 17 },
  { word: 'some', frequency: 16 },
  { word: 'state', frequency: 15 },
  { word: 'still', frequency: 14 },
  { word: 'such', frequency: 13 },
  { word: 'system', frequency: 12 },
  { word: 'take', frequency: 11 },
  { word: 'tell', frequency: 10 },
  { word: 'than', frequency: 9 },
  { word: 'that', frequency: 8 },
  { word: 'their', frequency: 7 },
  { word: 'them', frequency: 6 },
  { word: 'then', frequency: 5 },
  { word: 'there', frequency: 4 },
  { word: 'these', frequency: 3 },
  { word: 'they', frequency: 2 },
  { word: 'thing', frequency: 1 },

  // Less common words
  { word: 'able', frequency: 98 },
  { word: 'above', frequency: 96 },
  { word: 'across', frequency: 94 },
  { word: 'added', frequency: 92 },
  { word: 'almost', frequency: 88 },
  { word: 'along', frequency: 86 },
  { word: 'always', frequency: 84 },
  { word: 'among', frequency: 82 },
  { word: 'another', frequency: 78 },
  { word: 'answer', frequency: 76 },
  { word: 'become', frequency: 74 },
  { word: 'began', frequency: 72 },
  { word: 'begin', frequency: 68 },
  { word: 'behind', frequency: 66 },
  { word: 'below', frequency: 64 },
  { word: 'better', frequency: 62 },
  { word: 'black', frequency: 58 },
  { word: 'bring', frequency: 56 },
  { word: 'build', frequency: 54 },
  { word: 'built', frequency: 52 },
  { word: 'carry', frequency: 49 },
  { word: 'cause', frequency: 47 },
  { word: 'change', frequency: 45 },
  { word: 'check', frequency: 43 },
  { word: 'child', frequency: 41 },
  { word: 'clear', frequency: 39 },
  { word: 'close', frequency: 37 },
  { word: 'common', frequency: 35 },
  { word: 'company', frequency: 33 },
  { word: 'country', frequency: 31 },
  { word: 'course', frequency: 29 },
  { word: 'cover', frequency: 27 },
  { word: 'create', frequency: 25 },
  { word: 'during', frequency: 23 },
  { word: 'early', frequency: 21 },

  // Rare/uncommon words
  { word: 'aback', frequency: 0.5 },
  { word: 'abide', frequency: 0.6 },
  { word: 'abled', frequency: 0.7 },
  { word: 'abler', frequency: 0.8 },
  { word: 'abode', frequency: 0.9 },
  { word: 'acrid', frequency: 1.0 },
  { word: 'adage', frequency: 1.1 },
  { word: 'adapt', frequency: 1.2 },
  { word: 'adept', frequency: 1.3 },
  { word: 'admit', frequency: 1.4 },
  { word: 'adobe', frequency: 1.5 },
  { word: 'adorn', frequency: 1.6 },
  { word: 'adult', frequency: 1.7 },
  { word: 'affix', frequency: 1.8 },
  { word: 'afire', frequency: 1.9 },
  { word: 'afoul', frequency: 2.0 },
  { word: 'agile', frequency: 2.1 },
  { word: 'aglow', frequency: 2.2 },
  { word: 'aider', frequency: 2.3 },
  { word: 'aisle', frequency: 2.4 },
  { word: 'akin', frequency: 2.5 },
  { word: 'alarm', frequency: 2.6 },
  { word: 'alder', frequency: 2.7 },
  { word: 'alert', frequency: 2.8 },
  { word: 'alias', frequency: 2.9 },
  { word: 'alibi', frequency: 3.0 },
  { word: 'alien', frequency: 3.1 },
  { word: 'align', frequency: 3.2 },
  { word: 'alike', frequency: 3.3 },
  { word: 'alive', frequency: 3.4 },
  { word: 'allay', frequency: 3.5 },
  { word: 'allot', frequency: 3.6 },
  { word: 'allow', frequency: 3.7 },
  { word: 'alloy', frequency: 3.8 },
  { word: 'aloft', frequency: 3.9 },
  { word: 'alone', frequency: 4.0 },
  { word: 'aloof', frequency: 4.1 },
  { word: 'aloud', frequency: 4.2 },
  { word: 'alpha', frequency: 4.3 },
  { word: 'alter', frequency: 4.4 },
  { word: 'amass', frequency: 4.5 },
  { word: 'amaze', frequency: 4.6 },
  { word: 'amber', frequency: 4.7 },
  { word: 'amble', frequency: 4.8 },
  { word: 'amend', frequency: 4.9 },
  { word: 'amino', frequency: 5.0 },
  { word: 'amiss', frequency: 5.1 },
  { word: 'among', frequency: 5.2 },
  { word: 'ample', frequency: 5.3 },
  { word: 'amply', frequency: 5.4 },
  { word: 'amuse', frequency: 5.5 },
  { word: 'angel', frequency: 5.6 },
  { word: 'anger', frequency: 5.7 },
  { word: 'angle', frequency: 5.8 },
  { word: 'angry', frequency: 5.9 },
  { word: 'angst', frequency: 6.0 },
  { word: 'anime', frequency: 6.1 },
  { word: 'ankle', frequency: 6.2 },
  { word: 'annex', frequency: 6.3 },
  { word: 'annoy', frequency: 6.4 },
  { word: 'antic', frequency: 6.5 },
  { word: 'anvil', frequency: 6.6 },
  { word: 'aorta', frequency: 6.7 },
  { word: 'apart', frequency: 6.8 },
  { word: 'apathy', frequency: 6.9 },
  { word: 'aphid', frequency: 7.0 },
  { word: 'aplomb', frequency: 7.1 },
  { word: 'appeal', frequency: 7.2 },
  { word: 'appear', frequency: 7.3 },
  { word: 'append', frequency: 7.4 },
  { word: 'apple', frequency: 7.5 },
  { word: 'applied', frequency: 7.6 },
  { word: 'appoint', frequency: 7.7 },
  { word: 'approve', frequency: 7.8 },
];

function processWordData() {
  console.log('Processing word data...');

  // Filter to 4+ letters only
  const validWords = sampleWords.filter(w => w.word.length >= 4);

  console.log(`Filtered to ${validWords.length} words (4+ letters)`);

  // Sort by frequency (descending - most common first)
  validWords.sort((a, b) => b.frequency - a.frequency);

  // Create word list (just the words)
  const wordList = validWords.map(w => w.word);

  // Create frequency map (word -> rank)
  const frequencyMap: Record<string, number> = {};
  validWords.forEach((w, index) => {
    frequencyMap[w.word] = index + 1; // Rank starts at 1
  });

  // Ensure output directory exists
  const dataDir = path.join(process.cwd(), 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write word list
  fs.writeFileSync(
    path.join(dataDir, 'words.json'),
    JSON.stringify(wordList, null, 2)
  );

  // Write frequency data
  fs.writeFileSync(
    path.join(dataDir, 'wordFrequency.json'),
    JSON.stringify(frequencyMap, null, 2)
  );

  console.log(`✓ Created src/data/words.json (${wordList.length} words)`);
  console.log(`✓ Created src/data/wordFrequency.json`);
  console.log('\nSample words:');
  console.log('  Most common:', wordList.slice(0, 5).join(', '));
  console.log('  Least common:', wordList.slice(-5).join(', '));
}

// Run the script
processWordData();

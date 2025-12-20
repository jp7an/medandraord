import { Word, WordType, WordCategory, categoryToType } from '../state/types';

// Import JSON word files
import nounsData from './words/sv/nouns.json';
import verbsData from './words/sv/verbs.json';
import adjectivesData from './words/sv/adjectives.json';
import peopleData from './words/sv/people.json';
import placesData from './words/sv/places.json';

// Helper function to create Word objects from category data
function createWords(words: string[], category: WordCategory, startId: number): Word[] {
  const type = categoryToType[category];
  return words.map((text, index) => ({
    id: `${startId + index}`,
    text: text.toUpperCase(),
    type,
  }));
}

// Build the word database from JSON files
const allWords: Word[] = [
  ...createWords(nounsData, 'noun', 1),
  ...createWords(verbsData, 'verb', 10000),
  ...createWords(adjectivesData, 'adjective', 20000),
  ...createWords(peopleData, 'people', 30000),
  ...createWords(placesData, 'places', 40000),
];

export function getRandomWord(usedIds: Set<string>): Word | null {
  const availableWords = allWords.filter(w => !usedIds.has(w.id));
  
  if (availableWords.length === 0) {
    console.log('⚠️ Ordlistan är slut – återanvänder ord');
    // Fallback: allow repetitions if we've used all words
    return allWords[Math.floor(Math.random() * allWords.length)];
  }
  
  return availableWords[Math.floor(Math.random() * availableWords.length)];
}

export function getAllWords(): Word[] {
  return [...allWords];
}

export function getWordStats() {
  return {
    total: allWords.length,
    nouns: nounsData.length,
    verbs: verbsData.length,
    adjectives: adjectivesData.length,
    people: peopleData.length,
    places: placesData.length,
  };
}

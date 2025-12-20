import { Word, WordType } from '../state/types';

// Placeholder word database
// In production, this would come from expo-sqlite with 30,000 words
const placeholderWords: Word[] = [
  // Substantiv (nouns) - Blue
  { id: '1', text: 'KATT', type: 'substantiv' },
  { id: '2', text: 'HUS', type: 'substantiv' },
  { id: '3', text: 'BIL', type: 'substantiv' },
  { id: '4', text: 'BOK', type: 'substantiv' },
  { id: '5', text: 'DATOR', type: 'substantiv' },
  { id: '6', text: 'TELEFON', type: 'substantiv' },
  { id: '7', text: 'BORD', type: 'substantiv' },
  { id: '8', text: 'STOL', type: 'substantiv' },
  { id: '9', text: 'FÖNSTER', type: 'substantiv' },
  { id: '10', text: 'DÖRR', type: 'substantiv' },
  
  // Adjektiv (adjectives) - Orange
  { id: '11', text: 'STOR', type: 'adjektiv' },
  { id: '12', text: 'LITEN', type: 'adjektiv' },
  { id: '13', text: 'SNABB', type: 'adjektiv' },
  { id: '14', text: 'LÅNGSAM', type: 'adjektiv' },
  { id: '15', text: 'VIT', type: 'adjektiv' },
  { id: '16', text: 'SVART', type: 'adjektiv' },
  { id: '17', text: 'RÖD', type: 'adjektiv' },
  { id: '18', text: 'BLÅ', type: 'adjektiv' },
  { id: '19', text: 'GLAD', type: 'adjektiv' },
  { id: '20', text: 'LEDSEN', type: 'adjektiv' },
  
  // Verb (verbs) - Red
  { id: '21', text: 'SPRINGA', type: 'verb' },
  { id: '22', text: 'HOPPA', type: 'verb' },
  { id: '23', text: 'ÄTA', type: 'verb' },
  { id: '24', text: 'DRICKA', type: 'verb' },
  { id: '25', text: 'SOVA', type: 'verb' },
  { id: '26', text: 'LÄSA', type: 'verb' },
  { id: '27', text: 'SKRIVA', type: 'verb' },
  { id: '28', text: 'MÅLA', type: 'verb' },
  { id: '29', text: 'SJUNGA', type: 'verb' },
  { id: '30', text: 'DANSA', type: 'verb' },
  
  // Personer (people) - Pink
  { id: '31', text: 'LÄRARE', type: 'personer' },
  { id: '32', text: 'DOKTOR', type: 'personer' },
  { id: '33', text: 'POLIS', type: 'personer' },
  { id: '34', text: 'BRANDMAN', type: 'personer' },
  { id: '35', text: 'BAGARE', type: 'personer' },
  { id: '36', text: 'MÅLARE', type: 'personer' },
  { id: '37', text: 'MUSIKER', type: 'personer' },
  { id: '38', text: 'FÖRFATTARE', type: 'personer' },
  { id: '39', text: 'SKÅDESPELARE', type: 'personer' },
  { id: '40', text: 'IDROTTARE', type: 'personer' },
  
  // Platser (places) - Yellow
  { id: '41', text: 'SKOLA', type: 'platser' },
  { id: '42', text: 'SJUKHUS', type: 'platser' },
  { id: '43', text: 'AFFÄR', type: 'platser' },
  { id: '44', text: 'PARK', type: 'platser' },
  { id: '45', text: 'BIBLIOTEK', type: 'platser' },
  { id: '46', text: 'MUSEUM', type: 'platser' },
  { id: '47', text: 'RESTAURANG', type: 'platser' },
  { id: '48', text: 'KYRKA', type: 'platser' },
  { id: '49', text: 'STRAND', type: 'platser' },
  { id: '50', text: 'FLYGPLATS', type: 'platser' },
];

export function getRandomWord(usedIds: Set<string>): Word | null {
  const availableWords = placeholderWords.filter(w => !usedIds.has(w.id));
  
  if (availableWords.length === 0) {
    console.log('⚠️ Warning: Word database exhausted, allowing repetitions');
    // Fallback: allow repetitions if we've used all words
    return placeholderWords[Math.floor(Math.random() * placeholderWords.length)];
  }
  
  return availableWords[Math.floor(Math.random() * availableWords.length)];
}

export function getAllWords(): Word[] {
  return [...placeholderWords];
}

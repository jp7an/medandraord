// SQLite wrapper for future word database
// This module prepares for storing 30,000 words in expo-sqlite

import * as SQLite from 'expo-sqlite';
import { Word, WordType } from '../state/types';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<void> {
  try {
    db = await SQLite.openDatabaseAsync('medandraord.db');
    
    // Create words table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS words (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        type TEXT NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_word_type ON words(type);
    `);
    
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

export async function insertWords(words: Word[]): Promise<void> {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    for (const word of words) {
      await db.runAsync(
        'INSERT OR REPLACE INTO words (id, text, type) VALUES (?, ?, ?)',
        [word.id, word.text, word.type]
      );
    }
    console.log(`✅ Inserted ${words.length} words`);
  } catch (error) {
    console.error('❌ Error inserting words:', error);
  }
}

export async function getWordCount(): Promise<number> {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM words');
    return result?.count || 0;
  } catch (error) {
    console.error('❌ Error counting words:', error);
    return 0;
  }
}

export async function getRandomWordFromDb(usedIds: Set<string>): Promise<Word | null> {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const usedIdsArray = Array.from(usedIds);
    const placeholders = usedIdsArray.map(() => '?').join(',');
    const query = usedIdsArray.length > 0
      ? `SELECT * FROM words WHERE id NOT IN (${placeholders}) ORDER BY RANDOM() LIMIT 1`
      : 'SELECT * FROM words ORDER BY RANDOM() LIMIT 1';
    
    const result = await db.getFirstAsync<Word>(query, usedIdsArray);
    return result || null;
  } catch (error) {
    console.error('❌ Error getting random word:', error);
    return null;
  }
}

// Match history storage
export async function saveMatchHistory(matchData: string): Promise<void> {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    await db.runAsync(
      'CREATE TABLE IF NOT EXISTS match_history (id TEXT PRIMARY KEY, date INTEGER, data TEXT)'
    );
    
    const id = Date.now().toString();
    await db.runAsync(
      'INSERT INTO match_history (id, date, data) VALUES (?, ?, ?)',
      [id, Date.now(), matchData]
    );
    
    console.log('✅ Match history saved');
  } catch (error) {
    console.error('❌ Error saving match history:', error);
  }
}

export async function getMatchHistory(): Promise<string[]> {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    await db.runAsync(
      'CREATE TABLE IF NOT EXISTS match_history (id TEXT PRIMARY KEY, date INTEGER, data TEXT)'
    );
    
    const results = await db.getAllAsync<{ data: string }>(
      'SELECT data FROM match_history ORDER BY date DESC LIMIT 50'
    );
    
    return results.map(r => r.data);
  } catch (error) {
    console.error('❌ Error loading match history:', error);
    return [];
  }
}

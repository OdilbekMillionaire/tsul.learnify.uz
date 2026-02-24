/**
 * Lesson Storage Service
 * Manages saving and retrieving lessons from IndexedDB
 */

import { StoredLesson } from '../types';

const DB_NAME = 'learnify_db';
const DB_VERSION = 1;
const STORE_NAME = 'lessons';

let db: IDBDatabase | null = null;

async function initializeDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('module', 'module', { unique: false });
        store.createIndex('topic', 'topic', { unique: false });
        store.createIndex('tags', 'tags', { unique: false, multiEntry: true });
        store.createIndex('lastViewed', 'lastViewed', { unique: false });
      }
    };
  });
}

/**
 * Save a lesson to IndexedDB
 */
export async function saveLesson(lesson: StoredLesson): Promise<void> {
  const database = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(lesson);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Get a lesson by ID
 */
export async function getLesson(id: string): Promise<StoredLesson | null> {
  const database = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

/**
 * Get all lessons
 */
export async function getAllLessons(): Promise<StoredLesson[]> {
  const database = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const results = request.result as StoredLesson[];
      // Sort by lastViewed descending
      resolve(results.sort((a, b) => new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime()));
    };
  });
}

/**
 * Search lessons by title, topic, or module
 */
export async function searchLessons(query: string): Promise<StoredLesson[]> {
  const lessons = await getAllLessons();
  const lowerQuery = query.toLowerCase();

  return lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(lowerQuery) ||
      lesson.topic.toLowerCase().includes(lowerQuery) ||
      lesson.module.toLowerCase().includes(lowerQuery) ||
      lesson.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Delete a lesson
 */
export async function deleteLesson(id: string): Promise<void> {
  const database = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Update lesson rating and notes
 */
export async function updateLessonMetadata(
  id: string,
  updates: { rating?: number; userNotes?: string; tags?: string[] }
): Promise<void> {
  const lesson = await getLesson(id);
  if (!lesson) throw new Error('Lesson not found');

  const updated: StoredLesson = {
    ...lesson,
    rating: updates.rating ?? lesson.rating,
    userNotes: updates.userNotes ?? lesson.userNotes,
    tags: updates.tags ?? lesson.tags,
    lastViewed: new Date(),
  };

  await saveLesson(updated);
}

/**
 * Clear all lessons (use with caution)
 */
export async function clearAllLessons(): Promise<void> {
  const database = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Get storage statistics
 */
export async function getStorageStats(): Promise<{
  totalLessons: number;
  oldestLesson: Date | null;
  newestLesson: Date | null;
}> {
  const lessons = await getAllLessons();

  if (lessons.length === 0) {
    return {
      totalLessons: 0,
      oldestLesson: null,
      newestLesson: null,
    };
  }

  const dates = lessons.map((l) => new Date(l.createdAt).getTime());
  return {
    totalLessons: lessons.length,
    oldestLesson: new Date(Math.min(...dates)),
    newestLesson: new Date(Math.max(...dates)),
  };
}

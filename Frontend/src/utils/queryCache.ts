/**
 * queryCache.ts — lightweight in-memory TTL cache for API responses.
 *
 * Lives in module scope (survives React re-renders and page navigation)
 * but resets on tab refresh — intentional, prevents truly stale data.
 *
 * Usage:
 *   import { queryCache } from '../utils/queryCache';
 *
 *   // Read (returns null if missing or expired)
 *   const cached = queryCache.get<MyType>('/api/internships');
 *
 *   // Write with TTL
 *   queryCache.set('/api/internships', data, 3 * 60 * 1000);  // 3 min
 *
 *   // Invalidate on mutation
 *   queryCache.invalidate('/api/internships');
 *   queryCache.invalidatePattern('/api/students');  // all keys starting with prefix
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number; // Unix ms timestamp
}

// ─── TTL Presets (milliseconds) ────────────────────────────────────────────
export const TTL = {
  SHORT: 60 * 1000,       //  1 minute — high-churn data (stats)
  MEDIUM: 3 * 60 * 1000,  //  3 minutes — internship listings
  LONG: 5 * 60 * 1000,    //  5 minutes — student/recruiter rosters
} as const;

class QueryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  /** Returns cached data if present and not expired, otherwise null. */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  /** Stores data under key with a TTL in milliseconds. */
  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /** Returns true if a valid (non-expired) entry exists for key. */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /** Immediately removes a specific cache entry. */
  invalidate(key: string): void {
    this.store.delete(key);
  }

  /**
   * Removes all cache entries whose keys start with the given prefix.
   * Useful for invalidating a whole resource family (e.g. '/api/students').
   */
  invalidatePattern(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  /** Clears the entire cache. Useful on logout. */
  clear(): void {
    this.store.clear();
  }

  /** Returns the number of live (non-expired) entries currently cached. */
  size(): number {
    let count = 0;
    const now = Date.now();
    for (const entry of this.store.values()) {
      if (now <= entry.expiresAt) count++;
    }
    return count;
  }
}

// Singleton — shared across the entire app
export const queryCache = new QueryCache();

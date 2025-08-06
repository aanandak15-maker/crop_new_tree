interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 100; // Maximum number of entries

  set<T>(key: string, data: T, ttlMinutes: number = 30): void {
    // Clean up if cache is getting too large
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000, // Convert to milliseconds
    };

    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }

    // If still too large, remove oldest entries
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, Math.floor(this.maxSize * 0.2));
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      maxSize: this.maxSize,
    };
  }
}

// Singleton instance
export const cacheManager = new CacheManager();

// Cache decorator for async functions
export function cached<T extends (...args: any[]) => Promise<any>>(
  ttlMinutes: number = 30
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: Parameters<T>) {
      const cacheKey = `${propertyKey}_${JSON.stringify(args)}`;
      
      // Try to get from cache first
      const cachedResult = cacheManager.get(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Execute original method and cache result
      const result = await originalMethod.apply(this, args);
      cacheManager.set(cacheKey, result, ttlMinutes);
      
      return result;
    };

    return descriptor;
  };
}

// React Query integration
export const getCacheKey = (entity: string, params?: Record<string, any>) => {
  if (!params) return [entity];
  return [entity, params];
};

// Browser storage cache for persistence
export class PersistentCache {
  private storageKey: string;

  constructor(storageKey: string = 'app_cache') {
    this.storageKey = storageKey;
  }

  set<T>(key: string, data: T, ttlMinutes: number = 30): void {
    try {
      const entry = {
        data,
        timestamp: Date.now(),
        ttl: ttlMinutes * 60 * 1000,
      };

      const cache = this.getStorageCache();
      cache[key] = entry;
      
      localStorage.setItem(this.storageKey, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to cache data in localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const cache = this.getStorageCache();
      const entry = cache[key];

      if (!entry) return null;

      if (Date.now() - entry.timestamp > entry.ttl) {
        this.delete(key);
        return null;
      }

      return entry.data as T;
    } catch (error) {
      console.warn('Failed to get cached data from localStorage:', error);
      return null;
    }
  }

  delete(key: string): void {
    try {
      const cache = this.getStorageCache();
      delete cache[key];
      localStorage.setItem(this.storageKey, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to delete cached data from localStorage:', error);
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear cache from localStorage:', error);
    }
  }

  private getStorageCache(): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to parse cached data from localStorage:', error);
      return {};
    }
  }
}

export const persistentCache = new PersistentCache();
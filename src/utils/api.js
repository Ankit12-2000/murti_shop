export const API_BASE = 'https://mymurti-server-88q9.vercel.app';

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const apiFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      'ngrok-skip-browser-warning': 'true',
      ...options.headers,
    },
  });
};

// Cached GET — returns cached response if available, else fetches & caches
export const cachedFetch = async (url) => {
  const now = Date.now();
  const entry = cache.get(url);
  if (entry && now - entry.time < CACHE_TTL) {
    return entry.data;
  }
  const res = await apiFetch(url);
  const json = await res.json();
  cache.set(url, { data: json, time: now });
  return json;
};

// Clear specific cache entry
export const clearCache = (url) => cache.delete(url);

// Clear all cache
export const clearAllCache = () => cache.clear();

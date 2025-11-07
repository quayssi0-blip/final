import { supabaseClient } from "./supabaseClient";

// Cache for requests to prevent duplicates
const requestCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
};

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryWithBackoff(fn, retries = RETRY_CONFIG.maxRetries) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on certain errors
      if (error.name === "AbortError" || error.message?.includes("aborted")) {
        throw error;
      }

      if (attempt < retries) {
        const delay = Math.min(
          RETRY_CONFIG.baseDelay *
            Math.pow(RETRY_CONFIG.backoffFactor, attempt),
          RETRY_CONFIG.maxDelay,
        );
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

function getCacheKey(table, options = {}) {
  return `${table}_${JSON.stringify(options)}`;
}

function isCacheValid(timestamp) {
  return Date.now() - timestamp < CACHE_DURATION;
}

export async function supabaseFetcher(table, options = {}) {
  const cacheKey = getCacheKey(table, options);

  // Check cache first
  const cached = requestCache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  // If request is already in progress, wait for it
  if (cached && cached.promise) {
    return cached.promise;
  }

  // Create new request with retry logic
  const requestPromise = retryWithBackoff(async () => {
    let selectQuery = '*';
    
    // Configuration spécifique par table
    if (table === 'projects') {
      selectQuery = `
        id,
        slug,
        title,
        excerpt,
        image,
        categories,
        start_date,
        location,
        people_helped,
        status,
        content,
        goals,
        created_at,
        updated_at,
        project_images (
          id,
          image_url,
          alt_text
        )
      `;
    } else if (table === 'blog_posts') {
      selectQuery = `
        id,
        slug,
        title,
        excerpt,
        image,
        categories,
        content,
        created_at,
        updated_at,
        views,
        published
      `;
    }
    // Pour les autres tables (messages, admins, etc.), utiliser SELECT * par défaut

    const { data, error } = await supabaseClient
      .from(table)
      .select(selectQuery)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  });

  // Store promise in cache to prevent duplicate requests
  requestCache.set(cacheKey, {
    promise: requestPromise,
    timestamp: Date.now(),
  });

  try {
    const data = await requestPromise;

    // Update cache with actual data
    requestCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    // Remove failed request from cache
    requestCache.delete(cacheKey);
    throw error;
  }
}

// Clean up old cache entries periodically
setInterval(() => {
  for (const [key, value] of requestCache.entries()) {
    if (!isCacheValid(value.timestamp)) {
      requestCache.delete(key);
    }
  }
}, CACHE_DURATION);

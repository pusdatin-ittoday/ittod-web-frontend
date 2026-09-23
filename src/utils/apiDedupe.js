/**
 * In-Flight Request Deduplication and In-Memory Caching for Axios
 *
 * Prevents multiple components from firing identical concurrent network requests.
 * Collapses concurrent calls to the exact same URL into a single in-flight Promise.
 */

const inFlightRequests = new Map();
const responseCache = new Map();

/**
 * Configure TTL (milliseconds) for specific GET endpoints.
 * Endpoints not listed here have TTL = 0 (only in-flight deduplicated, no persistent cache).
 */
const CACHE_TTL_RULES = [
  { pattern: /\/api\/events/i, ttl: 30000 },
  { pattern: /\/api\/competitions\/results/i, ttl: 30000 },
  { pattern: /\/api\/competition-data/i, ttl: 30000 },
  { pattern: /\/api\/competition-timeline/i, ttl: 30000 },
  { pattern: /\/api\/timeline/i, ttl: 30000 },
  { pattern: /\/api\/announcements/i, ttl: 15000 },
  { pattern: /\/api\/user/i, ttl: 5000 },
];

function getTTL(url) {
  if (!url) return 0;
  for (const rule of CACHE_TTL_RULES) {
    if (rule.pattern.test(url)) {
      return rule.ttl;
    }
  }
  return 0;
}

function buildCacheKey(config) {
  const method = (config.method || "get").toLowerCase();
  const url = config.url || "";
  const params = config.params ? JSON.stringify(config.params) : "";
  const token =
    config.headers?.Authorization ||
    (typeof localStorage !== "undefined" ? localStorage.getItem("authToken") || "" : "");

  return `${method}:${url}:${params}:${token}`;
}

export function clearApiCache() {
  responseCache.clear();
}

/**
 * Attaches in-flight deduplication and short-lived caching to an Axios instance.
 * @param {import('axios').AxiosInstance} axiosInstance
 */
export function attachDedupeInterceptor(axiosInstance) {
  const originalRequest = axiosInstance.request.bind(axiosInstance);

  axiosInstance.request = async function (configOrUrl, maybeConfig) {
    let config;
    if (typeof configOrUrl === "string") {
      config = { ...(maybeConfig || {}), url: configOrUrl };
    } else {
      config = { ...configOrUrl };
    }

    const method = (config.method || "get").toLowerCase();

    // Mutations invalidate read cache
    if (method !== "get") {
      clearApiCache();
      return originalRequest(config);
    }

    const key = buildCacheKey(config);

    // 1. Check in-memory cache
    const cached = responseCache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      return Promise.resolve({
        ...cached.response,
        config,
      });
    }

    // 2. Check in-flight promise (merges simultaneous identical requests)
    if (inFlightRequests.has(key)) {
      return inFlightRequests.get(key);
    }

    // 3. Fire actual request and share promise
    const requestPromise = originalRequest(config)
      .then((response) => {
        inFlightRequests.delete(key);

        const ttl = getTTL(config.url);
        if (ttl > 0 && response.status === 200) {
          responseCache.set(key, {
            response: {
              data: response.data,
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            },
            expiresAt: Date.now() + ttl,
          });
        }

        return response;
      })
      .catch((error) => {
        inFlightRequests.delete(key);
        return Promise.reject(error);
      });

    inFlightRequests.set(key, requestPromise);
    return requestPromise;
  };

  return axiosInstance;
}

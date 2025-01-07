export const constants = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  TOKEN_EXPIRY: '24h',
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  CACHE_TTL: 3600, // 1 hour in seconds
  SECURITY_HEADERS: {
    FRAME_ANCESTORS: "'none'",
    CONTENT_SECURITY_POLICY: "default-src 'self'",
    REFERRER_POLICY: 'no-referrer'
  }
};
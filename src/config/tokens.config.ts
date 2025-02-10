export const TOKEN_CONFIG = {
  ACCESS_TOKEN: {
    SECRET: process.env.JWT_ACCESS_SECRET!,
    EXPIRES_IN: '30s',
    COOKIE_MAX_AGE: 30 * 1000, // 30 second in milliseconds
    // COOKIE_MAX_AGE: 15 * 60 * 1000, // 15 minutes in milliseconds
  },
  REFRESH_TOKEN: {
    SECRET: process.env.JWT_REFRESH_SECRET!,
    EXPIRES_IN: '7d',
    COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  },
} as const;

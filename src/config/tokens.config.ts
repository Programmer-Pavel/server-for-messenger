export const TOKEN_CONFIG = {
  ACCESS_TOKEN: {
    SECRET: process.env.JWT_ACCESS_SECRET!,
    EXPIRES_IN: '5m',
    COOKIE_MAX_AGE: 5 * 60 * 1000, // 5 minutes in milliseconds
  },
  REFRESH_TOKEN: {
    SECRET: process.env.JWT_REFRESH_SECRET!,
    EXPIRES_IN: '30m',
    COOKIE_MAX_AGE: 30 * 60 * 1000, // 30 minutes in milliseconds
  },
} as const;

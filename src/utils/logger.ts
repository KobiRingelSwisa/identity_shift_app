/**
 * Dev: console. Prod: keep errors on console; plug Crashlytics/Sentry here later.
 */
export const logger = {
  debug: (...args: unknown[]) => {
    if (__DEV__) console.log('[app]', ...args);
  },
  info: (...args: unknown[]) => {
    if (__DEV__) console.info('[app]', ...args);
  },
  warn: (...args: unknown[]) => {
    if (__DEV__) console.warn('[app]', ...args);
  },
  error: (...args: unknown[]) => {
    console.error('[app]', ...args);
  },
};

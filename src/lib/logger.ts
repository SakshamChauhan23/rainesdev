/**
 * Logger utility that respects environment
 * Only logs in development mode, preventing sensitive data leaks in production
 * Integrates with Sentry for production error tracking
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Lazy load Sentry only when needed (production errors)
let sentryModule: typeof import('@sentry/nextjs') | null = null;

async function getSentry() {
  if (!sentryModule && isProduction) {
    try {
      sentryModule = await import('@sentry/nextjs');
    } catch (error) {
      console.error('Failed to load Sentry:', error);
    }
  }
  return sentryModule;
}

class Logger {
  private logInternal(level: LogLevel, ...args: any[]) {
    if (!isDevelopment) {
      // In production, only log errors and send to Sentry
      if (level === 'error') {
        console.error(...args);

        // Send to Sentry in production
        if (isProduction) {
          getSentry().then(Sentry => {
            if (Sentry) {
              // Extract error object if present
              const error = args.find(arg => arg instanceof Error);
              if (error) {
                Sentry.captureException(error, {
                  extra: { context: args.filter(arg => !(arg instanceof Error)) }
                });
              } else {
                // Capture as message if no error object
                Sentry.captureMessage(args.join(' '), 'error');
              }
            }
          });
        }
      }
      return;
    }

    // In development, log everything
    console[level](...args);
  }

  info(...args: any[]) {
    this.logInternal('info', ...args);
  }

  warn(...args: any[]) {
    this.logInternal('warn', ...args);
  }

  error(...args: any[]) {
    this.logInternal('error', ...args);
  }

  debug(...args: any[]) {
    this.logInternal('debug', ...args);
  }

  // For backward compatibility with console.log
  log(...args: any[]) {
    this.logInternal('log', ...args);
  }
}

export const logger = new Logger();

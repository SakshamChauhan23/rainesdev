/**
 * Logger utility that respects environment
 * Only logs in development mode, preventing sensitive data leaks in production
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  private logInternal(level: LogLevel, ...args: any[]) {
    if (!isDevelopment) {
      // In production, only log errors (and optionally send to error tracking service)
      if (level === 'error') {
        console.error(...args);
        // TODO: Send to Sentry or error tracking service
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

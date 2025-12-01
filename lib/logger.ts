/**
 * Structured logging utility for the application
 * Provides consistent logging format across server and client
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('User logged in', { userId: '123' });
 *   logger.error('Failed to create request', error, { requestId: 'abc' });
 */

// =============================================================================
// Types
// =============================================================================

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

// =============================================================================
// Configuration
// =============================================================================

/**
 * Check if we're in development mode
 */
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Minimum log level based on environment
 * In production, only warn and error are logged to reduce noise
 */
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LOG_LEVEL: LogLevel = isDevelopment ? "debug" : "warn";

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Check if a log level should be output based on minimum level
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LOG_LEVEL];
}

/**
 * Format error object for logging
 * Extracts safe properties without circular references
 */
function formatError(
  error: unknown
): { name: string; message: string; stack?: string } | undefined {
  if (!error) return undefined;

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: isDevelopment ? error.stack : undefined,
    };
  }

  // Handle non-Error objects
  return {
    name: "UnknownError",
    message: String(error),
  };
}

/**
 * Sanitize context to remove sensitive data
 */
function sanitizeContext(context?: LogContext): LogContext | undefined {
  if (!context) return undefined;

  const sensitiveKeys = ["password", "token", "secret", "apiKey", "authorization"];
  const sanitized: LogContext = {};

  for (const [key, value] of Object.entries(context)) {
    if (sensitiveKeys.some((k) => key.toLowerCase().includes(k))) {
      sanitized[key] = "[REDACTED]";
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Create a formatted log entry
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  error?: unknown,
  context?: LogContext
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context: sanitizeContext(context),
    error: formatError(error),
  };
}

/**
 * Output log entry to console
 * In production, this could be replaced with a log service
 */
function outputLog(entry: LogEntry): void {
  const { level, message, context, error } = entry;

  // Create formatted output
  const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
  const contextStr = context ? ` ${JSON.stringify(context)}` : "";

  switch (level) {
    case "debug":
      console.debug(`${prefix} ${message}${contextStr}`);
      break;
    case "info":
      console.info(`${prefix} ${message}${contextStr}`);
      break;
    case "warn":
      console.warn(`${prefix} ${message}${contextStr}`);
      break;
    case "error":
      console.error(`${prefix} ${message}${contextStr}`);
      if (error) {
        console.error(`  Error: ${error.name}: ${error.message}`);
        if (error.stack && isDevelopment) {
          console.error(`  Stack: ${error.stack}`);
        }
      }
      break;
  }
}

// =============================================================================
// Logger API
// =============================================================================

export const logger = {
  /**
   * Log debug message (only in development)
   * @param message - Log message
   * @param context - Additional context data
   */
  debug(message: string, context?: LogContext): void {
    if (!shouldLog("debug")) return;
    const entry = createLogEntry("debug", message, undefined, context);
    outputLog(entry);
  },

  /**
   * Log info message
   * @param message - Log message
   * @param context - Additional context data
   */
  info(message: string, context?: LogContext): void {
    if (!shouldLog("info")) return;
    const entry = createLogEntry("info", message, undefined, context);
    outputLog(entry);
  },

  /**
   * Log warning message
   * @param message - Log message
   * @param context - Additional context data
   */
  warn(message: string, context?: LogContext): void {
    if (!shouldLog("warn")) return;
    const entry = createLogEntry("warn", message, undefined, context);
    outputLog(entry);
  },

  /**
   * Log error message with optional error object
   * @param message - Log message
   * @param error - Error object (optional)
   * @param context - Additional context data
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    if (!shouldLog("error")) return;
    const entry = createLogEntry("error", message, error, context);
    outputLog(entry);
  },

  /**
   * Create a child logger with preset context
   * Useful for adding request ID or user ID to all logs
   * @param baseContext - Context to include in all log entries
   */
  child(baseContext: LogContext) {
    return {
      debug: (message: string, context?: LogContext) =>
        logger.debug(message, { ...baseContext, ...context }),
      info: (message: string, context?: LogContext) =>
        logger.info(message, { ...baseContext, ...context }),
      warn: (message: string, context?: LogContext) =>
        logger.warn(message, { ...baseContext, ...context }),
      error: (message: string, error?: unknown, context?: LogContext) =>
        logger.error(message, error, { ...baseContext, ...context }),
    };
  },
};

// =============================================================================
// Specialized Loggers
// =============================================================================

/**
 * Logger for authentication-related events
 */
export const authLogger = logger.child({ module: "auth" });

/**
 * Logger for request/service operations
 */
export const serviceLogger = logger.child({ module: "service" });

/**
 * Logger for news management
 */
export const newsLogger = logger.child({ module: "news" });


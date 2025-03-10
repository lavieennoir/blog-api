import winston from 'winston';
import { singleton } from 'tsyringe';

@singleton()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: process.env.API_TITLE },
      transports: [
        // Write only error level logs to 'error.log'
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          dirname: 'logs',
          maxsize: 10485760, // 10MB
          maxFiles: 5,
        }),
        // Write all logs (error, warn, info, etc) to 'combined.log'
        new winston.transports.File({
          filename: 'logs/combined.log',
          dirname: 'logs',
          maxsize: 10485760, // 10MB
          maxFiles: 5,
        }),
      ],
    });

    // If we're not in production, log to the console with custom format
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, stack }) => {
              if (stack) {
                return `${timestamp} ${level}: ${message}\n${stack}`;
              }
              return `${timestamp} ${level}: ${message}`;
            })
          ),
        })
      );
    }
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error(message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, meta);
  }
}

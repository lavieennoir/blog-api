import { container } from '../../config/di.config';
import { LoggerService } from '../../services/logger.service';
import { createLogger, format, transports } from 'winston';

jest.mock('winston', () => ({
  createLogger: jest.fn(),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    json: jest.fn(),
    errors: jest.fn(),
    colorize: jest.fn(),
    printf: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

describe('LoggerService', () => {
  let loggerService: LoggerService;
  let mockLogger: any;

  beforeEach(() => {
    // Create mock logger
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      add: jest.fn(),
    };

    // Mock createLogger to return our mock logger
    (createLogger as jest.Mock).mockReturnValue(mockLogger);

    // Get instance of LoggerService
    container.clearInstances();
    loggerService = container.resolve(LoggerService);
  });

  describe('constructor', () => {
    it('should create logger with correct configuration', () => {
      expect(createLogger).toHaveBeenCalledWith({
        defaultMeta: { service: process.env.API_TITLE },
        level: 'info',
        transports: expect.any(Array),
      });

      // Verify format configuration
      expect(format.combine).toHaveBeenCalledWith(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
      );

      // Verify transports configuration
      expect(transports.Console).toHaveBeenCalledWith({});
      expect(transports.File).toHaveBeenCalledWith({
        dirname: 'logs',
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      });
    });

    it('should add console transport in non-production environment', () => {
      expect(mockLogger.add).toHaveBeenCalledWith({});
    });
  });

  describe('info', () => {
    it('should log info message', () => {
      const message = 'Test info message';
      const meta = { userId: '123' };

      loggerService.info(message, meta);

      expect(mockLogger.info).toHaveBeenCalledWith(message, meta);
    });

    it('should log info message without meta', () => {
      const message = 'Test info message';

      loggerService.info(message);

      expect(mockLogger.info).toHaveBeenCalledWith(message, undefined);
    });
  });

  describe('error', () => {
    it('should log error message', () => {
      const message = 'Test error message';
      const meta = { error: new Error('Test error') };

      loggerService.error(message, meta);

      expect(mockLogger.error).toHaveBeenCalledWith(message, meta);
    });

    it('should log error message without meta', () => {
      const message = 'Test error message';

      loggerService.error(message);

      expect(mockLogger.error).toHaveBeenCalledWith(message, undefined);
    });
  });

  describe('warn', () => {
    it('should log warning message', () => {
      const message = 'Test warning message';
      const meta = { reason: 'test' };

      loggerService.warn(message, meta);

      expect(mockLogger.warn).toHaveBeenCalledWith(message, meta);
    });

    it('should log warning message without meta', () => {
      const message = 'Test warning message';

      loggerService.warn(message);

      expect(mockLogger.warn).toHaveBeenCalledWith(message, undefined);
    });
  });

  describe('debug', () => {
    it('should log debug message', () => {
      const message = 'Test debug message';
      const meta = { details: 'test' };

      loggerService.debug(message, meta);

      expect(mockLogger.debug).toHaveBeenCalledWith(message, meta);
    });

    it('should log debug message without meta', () => {
      const message = 'Test debug message';

      loggerService.debug(message);

      expect(mockLogger.debug).toHaveBeenCalledWith(message, undefined);
    });
  });

  describe('error handling', () => {
    it('should handle error objects in meta', () => {
      const message = 'Test error message';
      const error = new Error('Test error');
      const meta = { error };

      loggerService.error(message, meta);

      expect(mockLogger.error).toHaveBeenCalledWith(message, {
        error,
      });
    });

    it('should handle circular references in meta', () => {
      const message = 'Test circular reference';
      const circular: any = { a: 1 };
      circular.self = circular;
      const meta = { circular };

      loggerService.info(message, meta);

      expect(mockLogger.info).toHaveBeenCalledWith(message, {
        circular: {
          a: 1,
          self: circular,
        },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    container.clearInstances();
  });
});

import { config } from '../config/config.js';

// Niveles de log
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

class Logger {
  constructor() {
    this.level = LOG_LEVELS[config.logging.level] || LOG_LEVELS.info;
    this.enableConsole = config.logging.enableConsole;
    this.enableFile = config.logging.enableFile;
  }

  // Método privado para formatear el mensaje
  #formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(data && { data })
    };

    return JSON.stringify(logEntry);
  }

  // Método privado para verificar si debe loggear
  #shouldLog(level) {
    return LOG_LEVELS[level] <= this.level;
  }

  // Método privado para escribir en consola
  #writeToConsole(level, message, data) {
    if (!this.enableConsole) return;

    const formattedMessage = this.#formatMessage(level, message, data);
    
    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'debug':
        console.debug(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }
  }

  // Método privado para escribir en archivo (implementación básica)
  #writeToFile(level, message, data) {
    if (!this.enableFile) return;
    
    // En una implementación real, aquí escribirías a un archivo
    // Por ahora, solo simulamos la funcionalidad
    const formattedMessage = this.#formatMessage(level, message, data);
    // fs.appendFileSync('logs/app.log', formattedMessage + '\n');
  }

  // Métodos públicos para logging
  error(message, data = null) {
    if (this.#shouldLog('error')) {
      this.#writeToConsole('error', message, data);
      this.#writeToFile('error', message, data);
    }
  }

  warn(message, data = null) {
    if (this.#shouldLog('warn')) {
      this.#writeToConsole('warn', message, data);
      this.#writeToFile('warn', message, data);
    }
  }

  info(message, data = null) {
    if (this.#shouldLog('info')) {
      this.#writeToConsole('info', message, data);
      this.#writeToFile('info', message, data);
    }
  }

  debug(message, data = null) {
    if (this.#shouldLog('debug')) {
      this.#writeToConsole('debug', message, data);
      this.#writeToFile('debug', message, data);
    }
  }

  // Método para logging de requests HTTP
  logRequest(req, res, next) {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress
      };

      if (res.statusCode >= 400) {
        this.error(`HTTP ${res.statusCode} - ${req.method} ${req.originalUrl}`, logData);
      } else {
        this.info(`HTTP ${res.statusCode} - ${req.method} ${req.originalUrl}`, logData);
      }
    });

    next();
  }

  // Método para logging de errores
  logError(error, req = null) {
    const errorData = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(req && {
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        params: req.params,
        query: req.query
      })
    };

    this.error('Error en la aplicación', errorData);
  }
}

// Instancia singleton del logger
export const logger = new Logger();

// Middleware para logging de requests
export const requestLogger = (req, res, next) => {
  logger.logRequest(req, res, next);
};

// Función para logging de errores
export const errorLogger = (error, req = null) => {
  logger.logError(error, req);
};


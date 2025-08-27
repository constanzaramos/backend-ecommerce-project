// Clases de errores personalizadas
export class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends CustomError {
  constructor(message) {
    super(message, 400);
  }
}

export class NotFoundError extends CustomError {
  constructor(resource = 'Recurso') {
    super(`${resource} no encontrado`, 404);
  }
}

export class ConflictError extends CustomError {
  constructor(message) {
    super(message, 409);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = 'No autorizado') {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = 'Acceso denegado') {
    super(message, 403);
  }
}


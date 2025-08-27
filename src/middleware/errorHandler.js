import { CustomError } from '../utils/errors.js';

export const handleValidationErrors = (req, res, next) => {
  const errors = req.validationErrors();
  if (errors) {
    const errorMessages = errors.map(error => error.msg);
    const error = new CustomError(`Errores de validación: ${errorMessages.join(', ')}`, 400);
    return next(error);
  }
  next();
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      error: err.message,
      status: err.statusCode,
      timestamp: new Date().toISOString()
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'JSON inválido en el cuerpo de la petición',
      status: 400,
      timestamp: new Date().toISOString()
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'JSON malformado en el cuerpo de la petición',
      status: 400,
      timestamp: new Date().toISOString()
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFoundHandler = (req, res, next) => {
  const error = new CustomError(`Ruta ${req.originalUrl} no encontrada`, 404);
  next(error);
};


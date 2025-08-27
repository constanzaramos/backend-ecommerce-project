import { body, param, query } from 'express-validator';

export const createProductValidations = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 3, max: 100 })
    .withMessage('El título debe tener entre 3 y 100 caracteres'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida')
    .isLength({ min: 10, max: 500 })
    .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero positivo'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('La categoría es requerida')
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
  
  body('code')
    .trim()
    .notEmpty()
    .withMessage('El código es requerido')
    .isLength({ min: 3, max: 20 })
    .withMessage('El código debe tener entre 3 y 20 caracteres'),
  
  body('status')
    .optional()
    .isBoolean()
    .withMessage('El status debe ser un valor booleano'),
  
  body('thumbnails')
    .optional()
    .isArray()
    .withMessage('Los thumbnails deben ser un array')
];

export const updateProductValidations = [
  param('pid')
    .isUUID()
    .withMessage('El ID del producto debe ser un UUID válido'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('El título debe tener entre 3 y 100 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero positivo'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
  
  body('code')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('El código debe tener entre 3 y 20 caracteres'),
  
  body('status')
    .optional()
    .isBoolean()
    .withMessage('El status debe ser un valor booleano'),
  
  body('thumbnails')
    .optional()
    .isArray()
    .withMessage('Los thumbnails deben ser un array')
];

export const getProductByIdValidations = [
  param('pid')
    .isUUID()
    .withMessage('El ID del producto debe ser un UUID válido')
];

export const deleteProductValidations = [
  param('pid')
    .isUUID()
    .withMessage('El ID del producto debe ser un UUID válido')
];

export const getProductsValidations = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número positivo'),
  
  query('sort')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('El orden debe ser "asc" o "desc"'),
  
  query('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio mínimo debe ser un número positivo'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio máximo debe ser un número positivo')
];


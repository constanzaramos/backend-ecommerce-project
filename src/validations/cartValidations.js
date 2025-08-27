import { param, body } from 'express-validator';

export const getCartByIdValidations = [
  param('cid')
    .isUUID()
    .withMessage('El ID del carrito debe ser válido')
];

export const addProductToCartValidations = [
  param('cid')
    .isUUID()
    .withMessage('El ID del carrito debe ser válido'),
  
  param('pid')
    .isUUID()
    .withMessage('El ID del producto debe ser válido'),
  
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero')
];

export const updateProductQuantityValidations = [
  param('cid')
    .isUUID()
    .withMessage('El ID del carrito debe ser válido'),
  
  param('pid')
    .isUUID()
    .withMessage('El ID del producto debe ser válido'),
  
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero')
];

export const removeProductFromCartValidations = [
  param('cid')
    .isUUID()
    .withMessage('El ID del carrito debe ser válido'),
  
  param('pid')
    .isUUID()
    .withMessage('El ID del producto debe ser un UUID válido')
];

export const clearCartValidations = [
  param('cid')
    .isUUID()
    .withMessage('El ID del carrito debe ser válido')
];


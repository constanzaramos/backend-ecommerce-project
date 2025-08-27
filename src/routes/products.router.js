import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  createProductValidations,
  updateProductValidations,
  getProductByIdValidations,
  deleteProductValidations,
  getProductsValidations
} from '../validations/productValidations.js';
import { validationResult } from 'express-validator';

const router = Router();
const manager = new ProductManager();

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({
      error: `Errores de validación: ${errorMessages.join(', ')}`,
      status: 400,
      timestamp: new Date().toISOString()
    });
  }
  next();
};

router.get('/', 
  getProductsValidations,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const result = await manager.getAll(req.query);
    res.json(result);
  })
);

router.get('/:pid', 
  getProductByIdValidations,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const product = await manager.getById(req.params.pid);
    res.json(product);
  })
);

router.post('/', 
  createProductValidations,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const newProduct = await manager.add(req.body);
    res.status(201).json(newProduct);
  })
);

router.put('/:pid', 
  updateProductValidations,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const updated = await manager.update(req.params.pid, req.body);
    res.json(updated);
  })
);

router.delete('/:pid', 
  deleteProductValidations,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const result = await manager.delete(req.params.pid);
    res.json(result);
  })
);

export default router;

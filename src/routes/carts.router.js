import { Router } from 'express';
import CartManager from '../managers/CartManager.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getCartByIdValidations,
  addProductToCartValidations,
  updateProductQuantityValidations,
  removeProductFromCartValidations,
  clearCartValidations
} from '../validations/cartValidations.js';
import { validationResult } from 'express-validator';

const router = Router();
const manager = new CartManager();

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

router.post('/', 
  asyncHandler(async (req, res) => {
    const newCart = await manager.createCart();
    res.status(201).json(newCart);
  })
);

router.get('/:cid', 
  getCartByIdValidations,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const cart = await manager.getCartById(req.params.cid);
    res.json(cart);
  })
);

router.post('/:cid/product/:pid', 
  addProductToCartValidations,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const quantity = req.body.quantity || 1;
    const cart = await manager.addProductToCart(req.params.cid, req.params.pid, quantity);
    res.json(cart);
  })
);

// Nuevas rutas para funcionalidad completa del carrito
router.put('/:cid/product/:pid', 
  updateProductQuantityValidations,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const cart = await manager.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
    res.json(cart);
  })
);

router.delete('/:cid/product/:pid', 
  removeProductFromCartValidations,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const cart = await manager.removeProductFromCart(req.params.cid, req.params.pid);
    res.json(cart);
  })
);

router.delete('/:cid', 
  clearCartValidations,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const cart = await manager.clearCart(req.params.cid);
    res.json(cart);
  })
);

export default router;

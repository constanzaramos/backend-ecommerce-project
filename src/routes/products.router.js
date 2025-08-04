import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager();

router.get('/', async (req, res) => {
  const products = await manager.getAll();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await manager.getById(req.params.pid);
  product
    ? res.json(product)
    : res.status(404).json({ error: 'Producto no encontrado' });
});

router.post('/', async (req, res) => {
  const newProduct = await manager.add(req.body);
  res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const updated = await manager.update(req.params.pid, req.body);
  updated
    ? res.json(updated)
    : res.status(404).json({ error: 'Producto no encontrado para actualizar' });
});

router.delete('/:pid', async (req, res) => {
  await manager.delete(req.params.pid);
  res.status(204).send(); 
});

export default router;

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { ValidationError, NotFoundError } from '../utils/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '../data/carts.json');

export default class CartManager {
  async #readFile() {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this.#writeFile([]);
        return [];
      }
      throw new Error(`Error al leer el archivo de carritos: ${error.message}`);
    }
  }

  async #writeFile(data) {
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error(`Error al escribir el archivo de carritos: ${error.message}`);
    }
  }

  async createCart() {
    try {
      const carts = await this.#readFile();
      const newCart = {
        id: randomUUID(),
        products: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      carts.push(newCart);
      await this.#writeFile(carts);
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear carrito: ${error.message}`);
    }
  }

  async getCartById(cid) {
    try {
      if (!cid || typeof cid !== 'string') {
        throw new ValidationError('ID de carrito inválido');
      }
      
      const carts = await this.#readFile();
      const cart = carts.find(c => c.id === cid);
      
      if (!cart) {
        throw new NotFoundError('Carrito');
      }
      
      return cart;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Error al obtener carrito por ID: ${error.message}`);
    }
  }

  async addProductToCart(cid, pid, quantity = 1) {
    try {
      if (!cid || typeof cid !== 'string') {
        throw new ValidationError('ID de carrito inválido');
      }
      
      if (!pid || typeof pid !== 'string') {
        throw new ValidationError('ID de producto inválido');
      }
      
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new ValidationError('La cantidad debe ser un número entero');
      }
      
      const carts = await this.#readFile();
      const cart = carts.find(c => c.id === cid);
      
      if (!cart) {
        throw new NotFoundError('Carrito');
      }
      
      const productInCart = cart.products.find(p => p.product === pid);
      if (productInCart) {
        productInCart.quantity += quantity;
      } else {
        cart.products.push({ product: pid, quantity });
      }
      
      cart.updatedAt = new Date().toISOString();
      await this.#writeFile(carts);
      return cart;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      if (!cid || typeof cid !== 'string') {
        throw new ValidationError('ID de carrito inválido');
      }
      
      if (!pid || typeof pid !== 'string') {
        throw new ValidationError('ID de producto inválido');
      }
      
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new ValidationError('La cantidad debe ser un número entero');
      }
      
      const carts = await this.#readFile();
      const cart = carts.find(c => c.id === cid);
      
      if (!cart) {
        throw new NotFoundError('Carrito');
      }
      
      const productInCart = cart.products.find(p => p.product === pid);
      if (!productInCart) {
        throw new NotFoundError('Producto en el carrito');
      }
      
      productInCart.quantity = quantity;
      cart.updatedAt = new Date().toISOString();
      await this.#writeFile(carts);
      return cart;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Error al actualizar cantidad del producto: ${error.message}`);
    }
  }

  async removeProductFromCart(cid, pid) {
    try {
      if (!cid || typeof cid !== 'string') {
        throw new ValidationError('ID de carrito inválido');
      }
      
      if (!pid || typeof pid !== 'string') {
        throw new ValidationError('ID de producto inválido');
      }
      
      const carts = await this.#readFile();
      const cart = carts.find(c => c.id === cid);
      
      if (!cart) {
        throw new NotFoundError('Carrito');
      }
      
      const productIndex = cart.products.findIndex(p => p.product === pid);
      if (productIndex === -1) {
        throw new NotFoundError('Producto en el carrito');
      }
      
      cart.products.splice(productIndex, 1);
      cart.updatedAt = new Date().toISOString();
      await this.#writeFile(carts);
      return cart;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
    }
  }

  async clearCart(cid) {
    try {
      if (!cid || typeof cid !== 'string') {
        throw new ValidationError('ID de carrito inválido');
      }
      
      const carts = await this.#readFile();
      const cart = carts.find(c => c.id === cid);
      
      if (!cart) {
        throw new NotFoundError('Carrito');
      }
      
      cart.products = [];
      cart.updatedAt = new Date().toISOString();
      await this.#writeFile(carts);
      return cart;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Error al vaciar carrito: ${error.message}`);
    }
  }
}

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { ValidationError, NotFoundError, ConflictError } from '../utils/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, '../data/products.json');

export default class ProductManager {
  async #readFile() {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this.#writeFile([]);
        return [];
      }
      throw new Error(`Error al leer el archivo de productos: ${error.message}`);
    }
  }

  async #writeFile(data) {
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error(`Error al escribir el archivo de productos: ${error.message}`);
    }
  }

  #validateProduct(product) {
    const requiredFields = ['title', 'description', 'price', 'stock', 'category', 'code'];
    const missingFields = requiredFields.filter(field => !product[field]);
    
    if (missingFields.length > 0) {
      throw new ValidationError(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
    }

    if (typeof product.title !== 'string' || product.title.trim().length < 3) {
      throw new ValidationError('El título debe ser una cadena de al menos 3 caracteres');
    }

    if (typeof product.description !== 'string' || product.description.trim().length < 10) {
      throw new ValidationError('La descripción debe ser una cadena de al menos 10 caracteres');
    }

    if (typeof product.price !== 'number' || product.price < 0) {
      throw new ValidationError('El precio debe ser un número positivo');
    }

    if (!Number.isInteger(product.stock) || product.stock < 0) {
      throw new ValidationError('El stock debe ser un número entero positivo');
    }

    if (typeof product.category !== 'string' || product.category.trim().length < 2) {
      throw new ValidationError('La categoría debe ser una cadena de al menos 2 caracteres');
    }

    if (typeof product.code !== 'string' || product.code.trim().length < 3) {
      throw new ValidationError('El código debe ser una cadena de al menos 3 caracteres');
    }

    return true;
  }

  async getAll(query = {}) {
    try {
      let products = await this.#readFile();
      
      if (query.category) {
        products = products.filter(p => p.category.toLowerCase().includes(query.category.toLowerCase()));
      }
      
      if (query.minPrice) {
        products = products.filter(p => p.price >= parseFloat(query.minPrice));
      }
      
      if (query.maxPrice) {
        products = products.filter(p => p.price <= parseFloat(query.maxPrice));
      }
      
      if (query.sort) {
        products.sort((a, b) => {
          if (query.sort === 'asc') {
            return a.price - b.price;
          } else {
            return b.price - a.price;
          }
        });
      }
      
      const limit = query.limit ? parseInt(query.limit) : products.length;
      const page = query.page ? parseInt(query.page) : 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedProducts = products.slice(startIndex, endIndex);
      
      return {
        products: paginatedProducts,
        total: products.length,
        page,
        limit,
        totalPages: Math.ceil(products.length / limit)
      };
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      if (!id || typeof id !== 'string') {
        throw new ValidationError('ID de producto inválido');
      }
      
      const products = await this.#readFile();
      const product = products.find(p => p.id === id);
      
      if (!product) {
        throw new NotFoundError('Producto');
      }
      
      return product;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Error al obtener producto por ID: ${error.message}`);
    }
  }

  async add(product) {
    try {
      this.#validateProduct(product);
      
      const products = await this.#readFile();
      
      const existingProduct = products.find(p => p.code === product.code);
      if (existingProduct) {
        throw new ConflictError(`Ya existe un producto con el código: ${product.code}`);
      }
      
      const newProduct = {
        id: randomUUID(),
        ...product,
        status: product.status !== undefined ? product.status : true,
        thumbnails: product.thumbnails || []
      };
      
      products.push(newProduct);
      await this.#writeFile(products);
      return newProduct;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ConflictError) {
        throw error;
      }
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  }

  async update(id, updates) {
    try {
      if (!id || typeof id !== 'string') {
        throw new ValidationError('ID de producto inválido');
      }
      
      const products = await this.#readFile();
      const index = products.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new NotFoundError('Producto');
      }
      
      if (updates.title && (typeof updates.title !== 'string' || updates.title.trim().length < 3)) {
        throw new ValidationError('El título debe ser una cadena de al menos 3 caracteres');
      }
      
      if (updates.price && (typeof updates.price !== 'number' || updates.price < 0)) {
        throw new ValidationError('El precio debe ser un número positivo');
      }
      
      if (updates.stock && (!Number.isInteger(updates.stock) || updates.stock < 0)) {
        throw new ValidationError('El stock debe ser un número entero');
      }
      
      if (updates.code) {
        const existingProduct = products.find(p => p.code === updates.code && p.id !== id);
        if (existingProduct) {
          throw new ConflictError(`Ya existe un producto con el código: ${updates.code}`);
        }
      }
      
      const { id: _, ...safeUpdates } = updates;
      products[index] = { ...products[index], ...safeUpdates };
      
      await this.#writeFile(products);
      return products[index];
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      if (!id || typeof id !== 'string') {
        throw new ValidationError('ID de producto inválido');
      }
      
      const products = await this.#readFile();
      const index = products.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new NotFoundError('Producto');
      }
      
      const updated = products.filter(p => p.id !== id);
      await this.#writeFile(updated);
      
      return { message: 'Producto eliminado exitosamente' };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

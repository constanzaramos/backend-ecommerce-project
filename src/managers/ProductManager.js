import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, '../data/products.json');

export default class ProductManager {
  async #readFile() {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async #writeFile(data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async getAll() {
    return await this.#readFile();
  }

  async getById(id) {
    const products = await this.#readFile();
    return products.find(p => p.id === id);
  }

  async add(product) {
    const products = await this.#readFile();
    const newProduct = {
      id: randomUUID(),
      ...product
    };
    products.push(newProduct);
    await this.#writeFile(products);
    return newProduct;
  }

  async update(id, updates) {
    const products = await this.#readFile();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const { id: _, ...safeUpdates } = updates;

    products[index] = { ...products[index], ...safeUpdates };
    await this.#writeFile(products);
    return products[index];
  }

  async delete(id) {
    const products = await this.#readFile();
    const updated = products.filter(p => p.id !== id);
    await this.#writeFile(updated);
  }
}

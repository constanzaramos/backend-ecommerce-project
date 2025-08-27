import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { validateConfig, getEnvironmentConfig } from './config/config.js';
import { requestLogger, errorLogger } from './utils/logger.js';

try {
  validateConfig();
} catch (error) {
  console.error('Error en la configuración:', error.message);
  process.exit(1);
}

const app = express();
const envConfig = getEnvironmentConfig();
const PORT = envConfig.server.port;

app.use(express.json({ limit: envConfig.limits.jsonSize }));
app.use(express.urlencoded({ extended: true, limit: envConfig.limits.urlEncoded }));

app.use(requestLogger);

app.use(express.static('public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
  res.json({
    message: '¡Servidor funcionando!',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      carts: '/api/carts'
    }
  });
});

app.use(notFoundHandler);

app.use((err, req, res, next) => {
  errorLogger(err, req);
  
  errorHandler(err, req, res, next);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   - Products: http://localhost:${PORT}/api/products`);
  console.log(`   - Carts: http://localhost:${PORT}/api/carts`);
}).on('error', (error) => {
  console.error('Error al iniciar el servidor:', error.message);
  process.exit(1);
});

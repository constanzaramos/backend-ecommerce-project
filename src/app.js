import express from 'express';
import productsRouter from './routes/products.router.js';


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static('public'));
app.use('/api/products', productsRouter);


app.get('/', (req, res) => {
  res.send('¡Servidor funcionando! 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

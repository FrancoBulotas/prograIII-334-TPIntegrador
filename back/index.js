
import express from 'express';
import env from './src/api/config/environments.js';
import cors from 'cors';

import productosRouter from './src/api/controllers/productos.js';
import categoriasRouter from './src/api/controllers/categorias.js';
import authRouter from './src/api/controllers/auth.js';

const PORT = env.port;
const app = express();

// Middlewares de aplicacion //
app.use(express.json()); 
// Middleware CORS basico que permite todas las solicitudes
app.use(cors()); 
// Middleware logger para analizar y logear todas las solicitudes
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

app.use("/api/productos", productosRouter);
app.use("/api/categorias", categoriasRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
});
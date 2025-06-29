
import express from 'express';
import env from './src/api/config/environments.js';
import cors from 'cors';

import middlewares from './src/api/middlewares/middlewares.js';
import productosRouter from './src/api/controllers/productos.js';
import categoriasRouter from './src/api/controllers/categorias.js';
import ventasRouter from './src/api/controllers/ventas.js';
import authRouter from './src/api/controllers/auth.js';

const PORT = env.port;
const app = express();

// Middlewares de aplicacion //
app.use(express.json()); 
// Middleware CORS basico que permite todas las solicitudes
app.use(cors()); 

app.use(middlewares.logger); 

app.use("/api/productos", productosRouter);
app.use("/api/categorias", categoriasRouter);
app.use("/api/ventas", ventasRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
});

import express from 'express';
import cors from 'cors';
import middlewares from './src/api/middlewares/middlewares.js';
import { productosRouter, viewRouter, categoriasRouter, ventasRouter } from './src/api/routes/index.js';
import authRouter from './src/api/controllers/auth.js';
import { __dirname, join } from './src/api/utils/index.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'src/views'));
app.use(express.static(join(__dirname, 'src/public')));

// Middlewares de aplicacion //
app.use(express.json()); 
// Middleware CORS basico que permite todas las solicitudes
app.use(cors()); 

app.use(middlewares.logger); 

// rutas de la API //
app.use("/api/productos", productosRouter);
app.use("/api/categorias", categoriasRouter);
app.use("/api/ventas", ventasRouter);
app.use("/api/auth", authRouter);

// rutas de la aplicacion ejs //
app.use('/dashboard', viewRouter);

export default app;

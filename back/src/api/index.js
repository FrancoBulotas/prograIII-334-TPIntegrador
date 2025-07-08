
import express from 'express';
import cors from 'cors';
import middlewares from './middlewares/middlewares.js';
import { productosRouter, viewRouter, categoriasRouter, ventasRouter } from './routes/index.js';
import authRouter from './controllers/auth.js';
import { __dirname, join } from './utils/index.js';

// import env from './config/environments.js';

// const PORT = env.port;

const app = express();

app.set('view engine', 'ejs');
app.set('views', join(__dirname, '../views'));
app.use(express.static(join(__dirname, '../public')));

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



// app.listen(PORT, () => {
//   console.log(`Servidor local corriendo en puerto ${PORT}`);
// });

export default app;

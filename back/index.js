
import express from 'express';
import env from './src/api/config/environments.js';
import cors from 'cors';

import productosRouter from './src/api/controllers/productos.js';

const PORT = env.port;
const app = express();


// Middlewares de aplicacion //
// Aplicados a nivel global para todas las solicitudes: autenticacion, registro de solicitudes o logging, analisis del cuerpo de la solicitud body parsing
// Middleware para parsear el JSON del body en peticiones POST, PUT o PATCH
app.use(express.json()); 
// Middleware CORS basico que permite todas las solicitudes
app.use(cors()); 
// Middleware logger para analizar y logear todas las solicitudes
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

app.use("/api/productos", productosRouter);

app.get("/", (req, res) => {
    res.send("Hola mundo.")
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
});
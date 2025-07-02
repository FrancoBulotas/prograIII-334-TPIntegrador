
import jwt from 'jsonwebtoken';
import env from '../config/environments.js';

// Middleware logger para analizar y logear todas las solicitudes
const logger = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
};

export const validarId = (req, res, next) => {
  const id = req.params.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'ID inválido.' });
  }

  next();
}

// en caso de que se mande un token en el header de la solicitud, se verifica que sea valido
// lo dejo por las dudas pero creo que con EJS no se va a usar
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded; // Ahora tenés el usuario en el request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export default {
    logger, 
    verificarToken,
    validarId
};

import { Router } from "express";
import connection  from '../database/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/environments.js';

const router = Router();

// [DONE] -	POST /registro
// [DONE] -	POST /login

router.post("/registro", async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    try {
        // para validar que no se repita el email
        const sqlEmailCheck = `SELECT * FROM usuarios WHERE email = ?`;
        const [rows] = await connection.query(sqlEmailCheck, [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        // para no permitir contraseñas menores a 4 caracteres
        if(password.length < 3){
            return res.status(400).json({ message: "La contraseña debe tener al menos 4 caracteres" });
        } 
        // para encriptar la contraseña
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const sql = `INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)`;

        const [result] = await connection.query(sql, [nombre, email, passwordHash, rol]);

        res.status(201).json({ message: "Usuario registrado exitosamente", userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar el usuario" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    const sql = `SELECT * FROM usuarios WHERE email = ?`;

    try {
        const [rows] = await connection.query(sql, [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const user = rows[0];
        // comparar la contraseña ingresada con la guardada en la base encriptada
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }
        // generar el token JWT
        // el token contiene el id del usuario y su rol, expira en 24 horas
        const token = jwt.sign({ id: user.id, rol: user.rol }, env.jwtSecret, { expiresIn: '24h' });

        res.status(200).json({ 
            message: "Login exitoso", 
            token, 
            user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
});

export default router;

import { Router } from "express";
import connection  from '../database/db.js';

const router = Router();

router.get("/", async (req, res) => {
    let sql = `SELECT * FROM productos`;

    try {
        let [rows] = await connection.query(sql);

        res.status(200).json({ 
            payload: rows,
            message: rows.length === 0 ? "No se encontraron productos" : "Productos encontrados"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error })
    }
});

router.get("/:id", async (req, res) => {
    let { id } = req.params;
    let sql = `SELECT * FROM productos WHERE id = ?`;    

    try {
        if (!id) {
            return res.status(400).json({ message: "El ID es requerido" });
        }
        let [rows] = await connection.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ payload: rows })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error })
    }
});

export default router;
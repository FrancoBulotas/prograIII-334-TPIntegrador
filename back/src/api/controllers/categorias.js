
import { Router } from "express";
import connection  from '../database/db.js';

const router = Router();

// [DONE] -	GET /categorias
// [DONE] -	GET /categorias/:id
// [DONE] -	POST /categorias *
// [DONE] -	PUT /categorias *
// [DONE] -	DELETE /categorias *

// * hace referencia a los endpoints que necesitas autenticacion de admin (todavia no implementado) 

router.get("/", async (req, res) => {
    let sql = `SELECT * FROM categorias`;

    try {
        let [rows] = await connection.query(sql);

        res.status(200).json({ 
            payload: rows,
            message: rows.length === 0 ? "No se encontraron categorias" : `${rows.length} Categorias encontradas`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }

});

router.get("/:id", async (req, res) => {
    let { id } = req.params;

    let sql = `SELECT * FROM categorias WHERE id_categoria = ?`;

    try {
        if (!id) {
            return res.status(400).json({ message: "El ID es requerido" });
        }

        let [rows] = await connection.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Categoria no encontrada" });
        }

        res.status(200).json({ payload: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});

router.post("/", async (req, res) => {
    let { nombre } = req.body;

    let sql = `INSERT INTO categorias (nombre) VALUES (?)`;

    try {
        if (!nombre) {
            return res.status(400).json({ message: "El nombre es requerido" });
        }

        let [result] = await connection.query(sql, [nombre]);

        res.status(201).json({ 
            message: "Categoria creada exitosamente",
            payload: { id: result.insertId, nombre }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});

router.put("/:id", async (req, res) => {
    let { id } = req.params;
    let { nombre } = req.body;

    let sql = `UPDATE categorias SET nombre = ? WHERE id_categoria = ?`;

    try {
        if (!id || !nombre) {
            return res.status(400).json({ message: "El ID y el nombre son requeridos" });
        }

        let [result] = await connection.query(sql, [nombre, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Categoria no encontrada" });
        }

        res.status(200).json({ 
            message: "Categoria actualizada exitosamente",
            payload: { id, nombre }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});

router.delete("/:id", async (req, res) => {
    let { id } = req.params;

    let sql = `DELETE FROM categorias WHERE id_categoria = ?`;

    try {
        if (!id) {
            return res.status(400).json({ message: "El ID es requerido" });
        }

        let [result] = await connection.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Categoria no encontrada" });
        }

        res.status(200).json({ message: "Categoria eliminada exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
}); 

export default router;
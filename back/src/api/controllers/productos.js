
import { Router } from "express";
import connection  from '../database/db.js';

const router = Router();

// [DONE] -	GET /productos
// [DONE] -	GET /productos/:id
// [DONE] -	POST /productos *
// [DONE] -	PUT /productos/:id *
// [DONE] -	DELETE /productos/:id *
// [TO-DO] -	PATCH O PUT /productos/:id/cambiarVisibilidad * (no deberia hacer falta crearlo, usando el PUT se podria cambiar el campo active)

// * hace referencia a los endpoints que necesitas autenticacion de admin (todavia no implementado) 

router.get("/", async (req, res) => {
    let sql = `SELECT * FROM productos`;

    try {
        let [rows] = await connection.query(sql);

        res.status(200).json({ 
            payload: rows,
            message: rows.length === 0 ? "No se encontraron productos" : `${rows.length} Productos encontrados`
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
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

        res.status(200).json({ payload: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});

router.post("/", async (req, res) => {
    let { nombre, precio, descripcion, imagen, active, id_categoria } = req.body;
    let sql = `INSERT INTO productos (nombre, precio, descripcion, imagen, active, id_categoria) VALUES (?, ?, ?, ?, ?, ?)`;

    try {
        if (!nombre || !precio || !descripcion || !imagen || active === undefined || !id_categoria) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        let [result] = await connection.query(sql, [nombre, precio, descripcion, imagen, active, id_categoria]);

        res.status(201).json({ 
            message: "Producto creado exitosamente",
            payload: { id: result.insertId, nombre, precio, descripcion, imagen, active, id_categoria }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }

});

// ver si hace falta que permita modificar todos los campos o solo algunos
router.put("/:id", async (req, res) => {
    let { id } = req.params;   
    let { nombre, precio, descripcion, imagen, active, id_categoria } = req.body;
    let sql = `UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, imagen = ?, active = ?, id_categoria = ? WHERE id_producto = ?`;    
   
    try {
        if (!id) {
            return res.status(400).json({ message: "El ID es requerido" });
        }

        if (!nombre || !precio || !descripcion || !imagen || active === undefined || !id_categoria) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        let [result] = await connection.query(sql, [nombre, precio, descripcion, imagen, active, id_categoria, id]);    
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ 
            message: "Producto actualizado exitosamente",
            payload: { id, nombre, precio, descripcion, imagen, active, id_categoria }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }   
}); 

router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    let sql = `DELETE FROM productos WHERE id_producto = ?`;

    try {
        if (!id) {
            return res.status(400).json({ message: "El ID es requerido" });
        }

        let [result] = await connection.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }   
});

export default router;

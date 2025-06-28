
import { Router } from "express";
import connection  from '../database/db.js';
import { DateTime } from "luxon";

const router = Router();

// [DONE] -	GET /ventas * 		    -> en este la idea es que se tome el carrito y se separe en prods y se agreguen en la tabla detalleVenta
// [DONE] -	GET /ventas/:id *
// [DONE] -	POST /ventas 		    -> se llama una vez se realiza la compra

// ver bien como implementar estas dos despues
// - GET /ventas/:id/ticket 	-> genera y obtiene el ticket de la compra realizada
// - GET /ventas/exportar * 	-> se podría hacer que se exporten todas las ventas en un Excel

// * hace referencia a los endpoints que necesitas autenticacion de admin (todavia no implementado) 

router.get("/", async (req, res) => {
    let sql = `SELECT * FROM ventas`;

    try {
        let [rows] = await connection.query(sql);

        // convertimos fechas a hora local de Buenos Aires (solo para mostrarse en el frontend, ya que en la base se guardan bien)
        // sin hacer esto la hora se para en UTC y no se ve bien en el frontend
        rows = rows.map(row => ({
            ...row,
            fecha: DateTime.fromJSDate(new Date(row.fecha))
                .setZone("America/Argentina/Buenos_Aires")
                .toFormat("yyyy-MM-dd HH:mm:ss")
        }));

        res.status(200).json({ 
            payload: rows,
            message: rows.length === 0 ? "No se encontraron ventas" : `${rows.length} Ventas encontradas`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});

router.get("/:id", async (req, res) => {
    let { id } = req.params;

    let sql = `SELECT * FROM ventas WHERE id_venta = ?`;

    try {
        if (!id) {
            return res.status(400).json({ message: "El ID es requerido" });
        }

        let [row] = await connection.query(sql, [id]);

        if (row.length === 0) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        res.status(200).json({ payload: row });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});

router.post("/", async (req, res) => {
    let { id_usuario, total } = req.body;

    let sql = `INSERT INTO ventas (id_usuario, fecha, total) VALUES (?, ?, ?)`;

    try {
        if (!id_usuario || !total) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        let fecha = DateTime.now()
            .setZone("America/Argentina/Buenos_Aires")
            .toFormat("yyyy-MM-dd HH:mm:ss");

        let [result] = await connection.query(sql, [id_usuario, fecha, total]);

        res.status(201).json({ 
            message: "Venta creada exitosamente",
            payload: { id_venta: result.insertId }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});

export default router;
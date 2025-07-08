
import connection from "../database/db.js";
import { DateTime } from "luxon";

const selectAllSales = async () => {
    let sql = `SELECT * FROM ventas`;
    return await connection.query(sql);
}

const selectSaleById = async (id) => {
    let sql = `SELECT * FROM ventas WHERE id_venta = ?`;
    return await connection.query(sql, [id]);
}

const insertNewSale = async (cliente, total) => {
    let sql = `INSERT INTO ventas (cliente, fecha, total) VALUES (?, ?, ?)`;
    
    let fecha = DateTime.now()
        .setZone("America/Argentina/Buenos_Aires")
        .toFormat("yyyy-MM-dd HH:mm:ss");

    return await connection.query(sql, [cliente, fecha, total]);
}

const selectAllSalesDetails = async () => {
    let sql = `SELECT * FROM detalleVenta`;
    return await connection.query(sql);
}

const selectSalesDetailsById = async (id) => {
    let sql = `SELECT * FROM detalleVenta WHERE id_venta = ?`;
    return await connection.query(sql, [id]);
}

const insertNewSaleDetail = async (id_venta, id_producto, cantidad, nombre, precio_unitario) => {
    let sql = `INSERT INTO detalleVenta (id_venta, id_producto, cantidad, nombre, precio_unitario) VALUES (?, ?, ?, ?, ?)`;
    return await connection.query(sql, [id_venta, id_producto, cantidad, nombre, precio_unitario]);
}
 
export default {
    selectAllSales,
    selectSaleById,
    insertNewSale,
    selectAllSalesDetails,
    selectSalesDetailsById,
    insertNewSaleDetail
}
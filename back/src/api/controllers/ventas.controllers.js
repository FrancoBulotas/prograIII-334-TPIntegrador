
import Venta from "../models/ventas.models.js"
import { DateTime } from "luxon";
import ExcelJS from 'exceljs';

// ventas:
// [DONE] -	GET /ventas * 		    -> en este la idea es que se tome el carrito y se separe en prods y se agreguen en la tabla detalleVenta
// [DONE] -	GET /ventas/:id *
// [DONE] -	POST /ventas 		    -> se llama una vez se realiza la compra

// ver bien como implementar estas dos despues
// - GET /ventas/:id/ticket 	-> genera y obtiene el ticket de la compra realizada
// - GET /ventas/exportar * 	-> se podría hacer que se exporten todas las ventas en un Excel

// detalleVenta:
// [DONE] -	GET /ventas/detalle * 
// [DONE] -	GET /ventas/detalle/:id * 	-> se podría buscar por id_venta o id_producto
// [DONE] -	POST /ventas/detalle 		-> se llama una vez se realiza la compra con con el id de la venta generada anteriormente


// * hace referencia a los endpoints que necesitas autenticacion de admin (todavia no implementado) 

export const getAllSales = async (req, res) => {
    try {
        let [rows] = await Venta.selectAllSales();

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
            message: rows.length === 0 ? "No se encontraron ventas" : `${rows.length} Ventas encontradas`,
            ok: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error, ok: false });
    }
}


export const selectSaleById = async (req, res) => {
    try {
        let { id } = req.params;

        let [row] = await Venta.selectSaleById(id);

        if (row.length === 0) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        res.status(200).json({ payload: row, ok: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error, ok: false });
    }
}


export const createSale = async (req, res) => {
    try {
        let { cliente, total } = req.body;

        if (!cliente || !total) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        let [result] = await Venta.insertNewSale(cliente, total);

        res.status(201).json({ 
            message: "Venta registrada exitosamente",
            payload: { id_venta: result.insertId },
            ok: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error, ok: false });
    }
}

export const getSalesDetails = async (req, res) => {
    try {
        let [rows] = await Venta.selectAllSalesDetails();

        res.status(200).json({ 
            payload: rows,
            message: rows.length === 0 ? "No se encontraron detalles de ventas" : `${rows.length} Detalles de ventas encontrados`,
            ok: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error, ok: false });
    }
} 

export const getSaleDetailById = async (req, res) => {    
    try {
        let { id } = req.params;
        let [row] = await Venta.selectSalesDetailsById(id);

        if (row.length === 0) {
            return res.status(404).json({ message: "Detalle de venta no encontrado" });
        }

        res.status(200).json({ payload: row, ok: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error, ok: false });
    }
}

export const createSaleDetail = async (req, res) => {
    let { id_venta, id_producto, cantidad, nombre, precio_unitario } = req.body;    

    try {
        if (!id_venta || !id_producto || !cantidad || !nombre || !precio_unitario) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        let [result] = await Venta.insertNewSaleDetail(id_venta, id_producto, cantidad, nombre, precio_unitario);

        res.status(201).json({ 
            message: "Detalle de venta registrado exitosamente",
            payload: { id_detalle: result.insertId },
            ok: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error, ok: false });
    }
}

export const descargarVentasExcel = async (req, res) => {
  try {
    const [ventas] = await Venta.selectAllSales();

    // creamos workbook y pestaña
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'AutoPartes Express';
    workbook.created  = new Date();

    const pestañaVentas = workbook.addWorksheet('Ventas');
    pestañaVentas.columns = [
      { header: 'ID Venta', key: 'id_venta', width: 10 },
      { header: 'Cliente', key: 'cliente', width: 20 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Total', key: 'total', width: 10}
    ];
    ventas.forEach(venta => pestañaVentas.addRow(venta));

    // enviamos como descarga
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="ventas_detalles.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error al generar Excel:', err);
    res.status(500).send('No se pudo exportar las ventas.');
  }
};
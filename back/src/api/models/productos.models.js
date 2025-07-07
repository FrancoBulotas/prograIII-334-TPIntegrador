
import connection from "../database/db.js";


const selectAllProducts = async () => {
    let sql = `SELECT * FROM productos`;
    
    return await connection.query(sql);
}

const selectProductFromId = async (id) => {
    let sql = `SELECT * FROM productos WHERE id_producto = ?`;
    
    return await connection.query(sql, [id]);
}

const selectProductosPaginados = async (limit, offset) => {
  const sql = `SELECT * FROM productos LIMIT ? OFFSET ?`;
  return await connection.query(sql, [limit, offset]);
};

const selectProductsFromCategoryId = async (id) => {
    let sql = 'SELECT * FROM productos WHERE id_categoria = ?'
    
    return await connection.query(sql, [id]);
}

// Opcional: obtener el conteo total para calcular totalPages
const countProductos = async () => {
  const sql = `SELECT COUNT(*) AS total FROM productos`;
  const [rows] = await connection.query(sql);
  return rows[0].total;
};


const insertNewProduct = async (nombre, precio, descripcion, imagen, active, id_categoria) => {
    let sql = `INSERT INTO productos (nombre, precio, descripcion, imagen, active, id_categoria) VALUES (?, ?, ?, ?, ?, ?)`;
    
    return await connection.query(sql, [nombre, precio, descripcion, imagen, active, id_categoria]);
}

const updateProduct = async (id, nombre, precio, descripcion, imagen, active, id_categoria) => {
    let sql = `UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, imagen = ?, active = ?, id_categoria = ? WHERE id_producto = ?`;
    
    return await connection.query(sql, [nombre, precio, descripcion, imagen, active, id_categoria, id]);
}

const deleteProduct = async (id) => {
    let sql = `DELETE FROM productos WHERE id_producto = ?`;
    
    return await connection.query(sql, [id]);
}   

export default {
    selectAllProducts,
    selectProductFromId,
    selectProductosPaginados,
    selectProductsFromCategoryId,
    countProductos,
    insertNewProduct,
    updateProduct,
    deleteProduct
}
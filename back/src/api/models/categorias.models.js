
import connection  from '../database/db.js';

const selectAllCategories = async () => {
    let sql = `SELECT * FROM categorias`;
    return await connection.query(sql);  
};

const selectCategoryById = async (id) => {
    let sql = `SELECT * FROM categorias WHERE id_categoria = ?`;
    return await connection.query(sql, [id]);  

};

const insertNewCategory = async (nombre) => {
    let sql = `INSERT INTO categorias (nombre) VALUES (?)`;
    return await connection.query(sql, [nombre]);
}

const updateCategory = async (id, nombre) => {
    let sql = `UPDATE categorias SET nombre = ? WHERE id_categoria = ?`;
    return await connection.query(sql, [nombre, id]);
}

const deleteCategory = async (id) => {
    let sql = `DELETE FROM categorias WHERE id_categoria = ?`;
    return await connection.query(sql, [id]);
}

export default {
    selectAllCategories,
    selectCategoryById,
    insertNewCategory,
    updateCategory,
    deleteCategory
};
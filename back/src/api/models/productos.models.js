
import connection from "../database/db.js";

const selectAllProducts = async () => {
    let sql = `SELECT * FROM productos`;
    
    return await connection.query(sql);
}

export default {
    selectAllProducts,
}
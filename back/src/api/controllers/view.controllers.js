
import Productos from "../models/productos.models.js";

export const getProductsList = async (req, res) => {
    try {
        let [rows] = await Productos.selectAllProducts();

        res.render('index', {
            title: 'AutoPartes Dashboard',
            products: rows,
            message: rows.length === 0 ? "No se encontraron productos" : `${rows.length} Productos encontrados`
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export default {
    getProductsList 
};

import Categories from '../models/categorias.models.js';


// [DONE] -	GET /categorias
// [DONE] -	GET /categorias/:id
// [DONE] -	POST /categorias *
// [DONE] -	PUT /categorias *
// [DONE] -	DELETE /categorias *

// * hace referencia a los endpoints que necesitas autenticacion de admin (todavia no implementado) 

export const getAllCategories =  async (req, res) => {
    try {
        let [rows] = await Categories.selectAllCategories();

        res.status(200).json({ 
            payload: rows,
            message: rows.length === 0 ? "No se encontraron categorias" : `${rows.length} Categorias encontradas`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
};

export const getCategoryById = async (req, res) => {
    let { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: "El ID es requerido" });
        }

        let [rows] = await Categories.selectCategoryById(id);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Categoria no encontrada" });
        }

        res.status(200).json({ payload: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
};

export const createCategory= async (req, res) => {
    let { nombre } = req.body;

    try {
        if (!nombre) {
            return res.status(400).json({ message: "El nombre es requerido" });
        }

        let [result] = await Categories.insertNewCategory(nombre);

        res.status(201).json({ 
            message: "Categoria creada exitosamente",
            payload: { id: result.insertId, nombre }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
};

export const modifyCategory = async (req, res) => {
    let { id } = req.params;
    let { nombre } = req.body;
    try {
        if (!id || !nombre) {
            return res.status(400).json({ message: "El ID y el nombre son requeridos" });
        }

        let [result] = await Categories.updateCategory(id, nombre);

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
};

export const removeCategory = async (req, res) => {
    let { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ message: "El ID es requerido" });
        }

        let [result] = await Categories.deleteCategory(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Categoria no encontrada" });
        }

        res.status(200).json({ message: "Categoria eliminada exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
}; 
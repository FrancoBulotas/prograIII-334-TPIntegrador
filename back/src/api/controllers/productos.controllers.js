
import Products from "../models/productos.models.js";

// [DONE] -	GET /productos
// [DONE] -	GET /productos/:id
// [DONE] -	POST /productos *
// [DONE] -	PUT /productos/:id *
// [DONE] -	DELETE /productos/:id *
// [TO-DO] -	PATCH O PUT /productos/:id/cambiarVisibilidad * (no deberia hacer falta crearlo, usando el PUT se podria cambiar el campo active)

// * hace referencia a los endpoints que necesitas autenticacion de admin (todavia no implementado) 

export const getAllProducts = async (req, res) => {
    try {
        const page  = Number(req.query.page)  || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        
        const [prods] = await Products.selectProductosPaginados(limit, offset);
        const totalItems = await Products.countProductos();
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({ 
            payload: prods,
            meta: {
                totalItems,
                totalPages,
                currentPage: page,
                perPage: limit
            },
            message: prods.length === 0 ? "No se encontraron productos" : `${prods.length} Productos encontrados`
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
};

export const getProductsFromCategory = async (req, res) => {
    try {
        let { id } = req.params;

        let [prods] = await Products.selectProductsFromCategoryId(id);
        
        if (prods.length === 0) {
            return { status: 404, message: "Productos no encontrados" };
        }

        res.status(200).json({ 
            message: "Productos encontrados",
            payload: prods          
        });

    } catch (e){
        console.error(error);
        res.status(500).json({ message: error });
    }
}

export const getProductById = async (req, res) => {
    try {
        let { id } = req.params;

        let [prods] = await Products.selectProductFromId(id);

        if (prods.length === 0) {
            return { status: 404, message: "Producto no encontrado" };
        }

        res.status(200).json({ 
            message: "Producto encontrado",
            payload: prods[0]           
        });
    } catch (error) {   
        console.error(error);
        res.status(500).json({ message: error });
    }
};

export const createProduct = async (req, res) => {
    try {
        let { nombre, precio, descripcion, imagen, active, id_categoria } = req.body;

        if (!nombre || !precio || !descripcion || !imagen || active === undefined || !id_categoria) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        let [result] = await Products.insertNewProduct(nombre, precio, descripcion, imagen, active, id_categoria);

        res.status(201).json({ 
            message: "Producto creado exitosamente",
            payload: { id: result.insertId, nombre, precio, descripcion, imagen, active, id_categoria }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
};

export const modifyProduct = async (req, res) => {
    try {
        let { id } = req.params;   
        let { nombre, precio, descripcion, imagen, active, id_categoria } = req.body;

        if (!nombre || !precio || !descripcion || !imagen || active === undefined || !id_categoria) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        let [result] = await Products.updateProduct(id, nombre, precio, descripcion, imagen, active, id_categoria);

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
}; 

export const removeProduct = async (req, res) => {
    try {
        let { id } = req.params;

        let [result] = await Products.deleteProduct(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }   
};



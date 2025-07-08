
import Products from "../models/productos.models.js";
import env from "../config/environments.js";

export const getProductsList = async (req, res) => {
    try {
        const q = req.query.q   || "";      
        const page = Number(req.query.page)  || 1; 
        const limit = Number(req.query.limit) || 6;
        const offset = (page - 1) * limit;

        // si hay busqueda por id, ignoramos paginación y hacemos filtro simple
        if (q) {
          const idBuscado = Number(q);
          const [todos] = await Products.selectAllProducts();
          const filtrados = todos.filter(p => p.id_producto === idBuscado);

          console.log(filtrados)
          return res.render("index", {
            title: "AutoPartes Dashboard",
            products: filtrados,
            q,
            page: 1,
            totalPages: 1,
            limit
          });
        }

        // traemos pagina de productos
        const [rows] = await Products.selectProductosPaginados(limit, offset);
        const totalItems = await Products.countProductos();
        const totalPages = Math.ceil(totalItems / limit);

        res.render('index', {
            title: 'AutoPartes Dashboard',
            products: rows,
            q: "",
            page,
            totalPages,
            limit
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const renderNewProductForm = (req, res) => {
  res.render('crearProducto', { title: 'Nuevo Producto' });
};

export const renderEditProductForm = async (req, res) => {
  const { id } = req.params;
  
  let [rows] = await Products.selectProductFromId(id);
  if (!rows.length) return res.redirect('/dashboard/productos');

  res.render('editarProducto', {
    title: `Editar #${id}`,
    product: rows[0]
  });
};


export const handleNewProduct = async (req, res) => {
  try {
    const { nombre, precio, descripcion, active, id_categoria } = req.body;

    if (!nombre || !precio || !descripcion || typeof active === "undefined" || !id_categoria) {
      return res.status(400).send("Todos los campos son requeridos");
    }
    // procesamos imagen
    if (!req.file) {
      return res.status(400).send("La imagen es requerida");
    }

    const imagenPublica = `https://progra-iii-334-tp-integrador.vercel.app/img/uploads/${req.file.filename}`;

    await Products.insertNewProduct(
      nombre,
      Number(precio),
      descripcion,
      imagenPublica,
      active === "true",
      Number(id_categoria)
    );
    // redirigir al listado
    res.redirect("/dashboard/productos");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear el producto");
  }
};

export const handleEditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion, active, id_categoria } = req.body;
    
    console.log(req.body)

    if (!nombre || !precio || !descripcion || typeof active === "undefined" || !id_categoria) {
      return res.status(400).send("Todos los campos son requeridos");
    }
    // obtenemos producto actual para saber la imagen anterior
    const [rows] = await Products.selectProductFromId(id);
    if (!rows.length) {
      return res.status(404).send("Producto no encontrado");
    }
    const producto = rows[0];
    // si se subio nuevaimagen la usamos, si no, mantenemos la anterior
    let imagenPublica = producto.imagen;
    if (req.file) {
      imagenPublica = `https://progra-iii-334-tp-integrador.vercel.app/img/uploads/${req.file.filename}`;
    }
    
    await Products.updateProduct(
      id,
      nombre,
      Number(precio),
      descripcion,
      imagenPublica,
      active === "true",
      Number(id_categoria)
    );
    res.redirect("/dashboard/productos");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el producto");
  }
};

export const handleDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Products.deleteProduct(id);

    res.redirect("/dashboard/productos");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el producto");
  }
}


export default {
    getProductsList,
    renderNewProductForm,
    renderEditProductForm,
    handleNewProduct,
    handleEditProduct,
    handleDeleteProduct
};
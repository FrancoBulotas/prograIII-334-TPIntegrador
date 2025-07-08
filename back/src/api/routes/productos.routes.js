

import { Router } from "express";
import { getAllProducts, getProductById, createProduct, modifyProduct, removeProduct, getProductsFromCategory } from "../controllers/productos.controllers.js";
import { validarId } from "../middlewares/middlewares.js";

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', validarId, getProductById);
router.get('/categoria/:id', validarId, getProductsFromCategory);
router.post('/', createProduct);
router.put('/:id', validarId, modifyProduct);
router.delete('/:id', validarId, removeProduct);


export default router;
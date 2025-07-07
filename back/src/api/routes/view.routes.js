
import { Router } from 'express';
import {
    getProductsList,
    renderNewProductForm,
    renderEditProductForm,
    handleNewProduct,
    handleEditProduct,
    handleDeleteProduct
} from '../controllers/view.controllers.js';

import multer from "multer";

const upload = multer({ dest: "src/public/img/uploads" });

const router = Router();

router.get('/productos', getProductsList);
router.post('/productos/nuevo', upload.single("imagen"), handleNewProduct);
router.post('/productos/:id/editar', upload.single("imagen"), handleEditProduct);
router.post('/productos/:id/eliminar', handleDeleteProduct);

router.get('/productos/nuevo', renderNewProductForm);
router.get('/productos/:id/editar', renderEditProductForm);

export default router;



import { Router } from "express";
import { getAllSales, selectSaleById, createSale, getSalesDetails, getSaleDetailById, createSaleDetail } from "../controllers/ventas.controllers.js";
import { validarId } from "../middlewares/middlewares.js";

const router = Router();

router.get('/', getAllSales);
router.get('/:id', validarId, selectSaleById);
router.post('/', createSale);
router.get('/obtener/detalle', getSalesDetails);
router.get('/detalle/:id', validarId, getSaleDetailById);
router.post('/detalle', createSaleDetail);


export default router;
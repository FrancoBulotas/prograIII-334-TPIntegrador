
import { Router } from "express";

import { getProductsList } from "../controllers/view.controllers.js";

const router = Router();

router.get('/', getProductsList);

router.get('/productos', (req, res) => {
    res.render('productos', {
        title: 'AutoPartes Dashboard',
    });
});

export default router;
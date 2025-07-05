
import { Router } from "express";
import{getAllCategories, getCategoryById, createCategory, modifyCategory, removeCategory} from "../controllers/categorias.controlers.js";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id",getCategoryById);
router.post("/",createCategory);
router.put("/:id",modifyCategory);
router.delete("/:id", removeCategory); 

export default router; 
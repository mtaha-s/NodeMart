import express from "express";
import {createInventoryItem, getAllInventory, getInventoryById, updateInventoryItem, deleteInventoryItem} from "../controllers/inventory.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const inventoryRoutes = express.Router();

inventoryRoutes.post("/", verifyJWT, upload.single("image"), createInventoryItem);
inventoryRoutes.get("/", verifyJWT, getAllInventory);
inventoryRoutes.get("/:id", verifyJWT, getInventoryById);
inventoryRoutes.put("/:id", verifyJWT, upload.single("image"), updateInventoryItem);
inventoryRoutes.delete("/:id", verifyJWT, deleteInventoryItem);

export { inventoryRoutes };
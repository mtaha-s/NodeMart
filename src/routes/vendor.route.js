import express from "express";
import { createVendor, getAllVendors, getVendorById, updateVendor, deleteVendor } from "../controllers/vendor.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const vendorRoutes = express.Router();

vendorRoutes.post("/", verifyJWT, createVendor);
vendorRoutes.get("/", verifyJWT, getAllVendors);
vendorRoutes.get("/:id", verifyJWT, getVendorById);
vendorRoutes.put("/:id", verifyJWT, updateVendor);
vendorRoutes.delete("/:id", verifyJWT, deleteVendor);

export { vendorRoutes };
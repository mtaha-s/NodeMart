import express from "express";
import { createVendor, getAllVendors, getVendorById, updateVendor, deleteVendor } from "../controllers/vendor.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

// Vendor Routes
const vendorRoutes = express.Router();

// All routes are protected and require admin role for modifications
vendorRoutes.post("/", verifyJWT, authorizeRoles("admin"), createVendor);
vendorRoutes.get("/", verifyJWT, getAllVendors);
vendorRoutes.get("/:id", verifyJWT, getVendorById);
vendorRoutes.put("/:id", verifyJWT, authorizeRoles("admin"), updateVendor);
vendorRoutes.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteVendor);

// Export the router
export { vendorRoutes };
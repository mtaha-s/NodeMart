import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const dashboardRoutes = express.Router();

// Admin Dashboard
dashboardRoutes.get("/", verifyJWT, authorizeRoles("admin"), getDashboardStats);

export { dashboardRoutes };

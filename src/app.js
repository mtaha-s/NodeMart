import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//import routes
import { adminRouters, authenticationRoutes } from "./routes/user.route.js";
import { inventoryRoutes } from "./routes/inventory.route.js";
import { vendorRoutes } from "./routes/vendor.route.js";
import { dashboardRoutes } from "./routes/dashboard.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

//initialize express app
const app = express();

// Middlewares
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5000"],
    credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser());

//routes declerations
app.use("/api/v1/auth", authenticationRoutes)
app.use("/api/v1/users", adminRouters) // Admin user management routes
app.use("/api/v1/inventories", inventoryRoutes)
app.use("/api/v1/vendors", vendorRoutes)
app.use("/api/v1/dashboard", dashboardRoutes);

// Global error handler (must be last)
app.use(errorHandler);

// Health check route
app.get("/", (req, res) => { res.status(200).json({ message: "Server is running" }); });

// Export the app for use in server.js
export { app };
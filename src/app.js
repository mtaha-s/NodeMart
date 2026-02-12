import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "express";

//import routes
import { authenticationRoutes } from "./routes/user.route.js";

//initialize express app
const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser());

//routes declerations
app.use("/api/users", authenticationRoutes)

// Health check route
app.get("/", (req, res) => { res.status(200).json({ message: "Server is running" }); });

// Export the app for use in server.js
export { app };
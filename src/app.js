import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser());

//import routes
import uploadRoutes from "./routes/upload.route.js";
import userRouter from "./routes/user.route.js";

//routes declerations
app.use('/api', uploadRoutes);
app.use("/api/users", userRouter)

export { app };
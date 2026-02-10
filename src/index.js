import dotenv from "dotenv";
import connectDB from "./database/database.js";

dotenv.config({
    path: './env'
})

connectDB();

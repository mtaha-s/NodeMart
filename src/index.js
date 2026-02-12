import dotenv from "dotenv";
import { connectDB } from "./database/database.js";
import { app } from "./app.js";

// Load environment variables from .env file
dotenv.config({
    path: './.env'
})

// Connect to MongoDB and start the server
connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

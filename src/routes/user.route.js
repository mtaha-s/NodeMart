import express from "express";
import {registerUser, loginUser, logoutUser, getCurrentUser, changeUserPassword, updateUserAvatar} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

// User Routes
const authenticationRoutes = express.Router();

// Public Routes
authenticationRoutes.post("/register", registerUser);
authenticationRoutes.post("/login", loginUser);

// Protected Routes (Require JWT)
authenticationRoutes.post("/logout", verifyJWT, logoutUser);
authenticationRoutes.get("/currentUser", verifyJWT, getCurrentUser);
authenticationRoutes.post("/changeUserPassword", verifyJWT, changeUserPassword);
authenticationRoutes.patch("/updateAvatar", verifyJWT, upload.single("avatar"), updateUserAvatar);

// Export the router
export { authenticationRoutes };

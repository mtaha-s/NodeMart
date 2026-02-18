import express from "express";
import {registerUser, loginUser, logoutUser, getCurrentUser, changeUserPassword, updateUserAvatar, getAllUsers, updateUserRole, deleteUser} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

// User Routes
const authenticationRoutes = express.Router();
const adminRouters = express.Router();

// Public Routes
authenticationRoutes.post("/register", registerUser);
authenticationRoutes.post("/login", loginUser);

// Protected Routes (Require JWT)
authenticationRoutes.post("/logout", verifyJWT, logoutUser);
authenticationRoutes.get("/currentUser", verifyJWT, getCurrentUser);
authenticationRoutes.post("/changeUserPassword", verifyJWT, changeUserPassword);
authenticationRoutes.patch("/updateAvatar", verifyJWT, upload.single("avatar"), updateUserAvatar);

// Admin routes - Get all users, update role, delete user
adminRouters.get("/all", verifyJWT, getAllUsers);
adminRouters.put("/:userId/role", verifyJWT, updateUserRole);
adminRouters.delete("/:userId", verifyJWT, deleteUser);

// Export the routers
export { authenticationRoutes, adminRouters };

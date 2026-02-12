import express from "express";
import {registerUser, loginUser, logoutUser, getCurrentUser, changeUserPassword, updateUserAvatar} from "../controllers/user.controller.js";

const authenticationRoutes = express.Router();

// Auth & user management routes
authenticationRoutes.post("/register", registerUser);
authenticationRoutes.post("/login", loginUser);
authenticationRoutes.post("/logout", logoutUser);
authenticationRoutes.get("/currentUser", getCurrentUser);
authenticationRoutes.post("/changeUserPassword", changeUserPassword);

export { authenticationRoutes };

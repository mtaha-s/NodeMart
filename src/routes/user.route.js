import express from "express";
import {registerUser, loginUser, logoutUser, getCurrentUser, changeUserPassword, refreshAccessToken, updateUserAvatar, generateAccessAndRefereshTokens} from "../controllers/user.controller.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";

const authenticationRoutes = express.Router();

// Auth & user management routes
authenticationRoutes.post("/register", registerUser);
authenticationRoutes.post("/login", loginUser);
// router.post("/logout", verifyJWT, logoutUser);
// router.get("/currentUser", verifyJWT, getCurrentUser);
// router.post("/changeUserPassword", verifyJWT, changeUserPassword);
// router.post("/refreshToken", refreshAccessToken);
// router.post("/generateTokens", generateAccessAndRefereshTokens);

// Avatar update route (protected)
// router.patch("/updateAvatar", verifyJWT, upload.single("avatar"), updateUserAvatar);

export { authenticationRoutes };

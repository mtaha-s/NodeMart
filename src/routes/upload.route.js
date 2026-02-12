import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadFile } from "../controllers/upload.controller.js";

const router = Router();

router.route("/upload").post(upload.single("file"), uploadFile);

export default router;

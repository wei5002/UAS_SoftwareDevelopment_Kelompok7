import express from "express";
import multer from "multer";
import { uploadBuktiTransfer } from "../controller/upload-controller.js";

const router = express.Router();
const upload = multer(); // pakai buffer

router.post("/upload", upload.single("gambar"), uploadBuktiTransfer);

export default router;

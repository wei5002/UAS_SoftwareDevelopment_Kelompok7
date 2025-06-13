import express from "express";
import multer from "multer";
import { uploadProdukImage } from "../controller/upload-produk-controller.js";
import { adminMiddleware } from "../middleware/admin-middleware.js";

const router = express.Router();

// Menggunakan memoryStorage agar file diproses sebagai buffer
const upload = multer({ storage: multer.memoryStorage() });

// Definisikan route POST untuk unggah gambar produk
// Route ini dilindungi oleh adminMiddleware agar hanya admin yang bisa mengunggah
// 'image' harus cocok dengan key FormData di frontend
router.post(
  "/api/upload-produk", 
  adminMiddleware, 
  upload.single("image"), // 'image' adalah key dari FormData
  uploadProdukImage
);

export {
  router as uploadProdukRouter
};

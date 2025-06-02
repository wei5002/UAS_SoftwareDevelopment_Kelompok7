import express from "express";
import keranjangController from "../controller/keranjangBelanja-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";         // pelanggan only
import { authBothMiddleware } from "../middleware/auth-both-middleware.js"; // pelanggan + admin

const router = new express.Router();

// GET → Boleh diakses oleh pelanggan ATAU admin
router.get("/api/keranjang/:userId", authBothMiddleware, keranjangController.getAllByUser);
router.get("/api/keranjang/item/:id", authBothMiddleware, keranjangController.getById);

// POST, PATCH, DELETE → Hanya pelanggan
router.post("/api/keranjang", authMiddleware, keranjangController.create);
router.patch("/api/keranjang/:id/jumlah", authMiddleware, keranjangController.updateJumlah);
router.patch("/api/keranjang/:id/spesifikasi", authMiddleware, keranjangController.updateSpesifikasi);
router.delete("/api/keranjang/:id", authMiddleware, keranjangController.remove);

export {
  router
};

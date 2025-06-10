import express from "express";
import keranjangController from "../controller/keranjangBelanja-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";         // pelanggan only
import { authBothMiddleware } from "../middleware/auth-both-middleware.js"; // pelanggan + admin

const router = new express.Router();

// GET → Pelanggan ambil semua item keranjang miliknya → /my
router.get("/api/keranjang/my", authMiddleware, keranjangController.getAllByUser);

// GET → Ambil item keranjang by ID (pelanggan / admin) → /item/:id
router.get("/api/keranjang/item/:id", authBothMiddleware, keranjangController.getById);

// POST → Pelanggan tambah item ke keranjang
router.post("/api/keranjang", authMiddleware, keranjangController.create);

// PATCH → Pelanggan update jumlah item
router.patch("/api/keranjang/:id/jumlah", authMiddleware, keranjangController.updateJumlah);

// PATCH → Pelanggan update spesifikasi item (jumlah, size, thickness, hole)
router.patch("/api/keranjang/:id/spesifikasi", authMiddleware, keranjangController.updateSpesifikasi);

// PATCH → Tandai item keranjang sebagai sudah diorder
router.patch("/api/keranjang/:id/markAsOrdered", authMiddleware, keranjangController.markAsOrdered);

// DELETE → Pelanggan hapus item dari keranjang
router.delete("/api/keranjang/:id", authMiddleware, keranjangController.remove);

export {
  router
};

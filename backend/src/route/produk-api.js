import express from "express";
import produkController from "../controller/produk-controller.js";
import { adminMiddleware } from "../middleware/admin-middleware.js";
import { authBothMiddleware } from "../middleware/auth-both-middleware.js"; // ← middleware gabungan

const router = new express.Router();

// Public: Ambil semua produk
router.get('/api/produk', produkController.getAll);

// Pelanggan atau Admin: Ambil detail produk berdasarkan ID
router.get('/api/produk/:id', authBothMiddleware, produkController.getById);

router.put('/api/produk/:id', authBothMiddleware, produkController.update);

// Admin only: Tambah, Edit, Hapus produk
router.post('/api/produk', adminMiddleware, produkController.create);
router.delete('/api/produk/:id', adminMiddleware, produkController.remove);

export {
  router
};

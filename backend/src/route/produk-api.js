import express from "express";
import produkController from "../controller/produk-controller.js";
import { adminMiddleware } from "../middleware/admin-middleware.js";
import { authBothMiddleware } from "../middleware/auth-both-middleware.js";

const router = new express.Router();

// Public: Ambil semua produk (bisa filter status/kategori)
router.get('/api/produk', produkController.getAll);

// Pelanggan atau Admin: Ambil detail produk berdasarkan ID
router.get('/api/produk/:id', authBothMiddleware, produkController.getById);

// Pelanggan/Admin: Update produk (termasuk edit data & status)
router.put('/api/produk/:id', authBothMiddleware, produkController.update);

// --- Tambahkan PATCH untuk nonaktifkan/aktifkan produk (soft delete) ---
router.patch('/api/produk/:id/status', adminMiddleware, async (req, res, next) => {
  try {
    // Patch hanya field status, tanpa mengubah data lain
    const result = await produkController.update(req, res, next);
    // hasilnya sudah ditangani oleh produkController.update
  } catch (error) {
    next(error);
  }
});

// Admin only: Tambah, Edit, Hapus produk
router.post('/api/produk', adminMiddleware, produkController.create);
router.delete('/api/produk/:id', adminMiddleware, produkController.remove);

export {
  router
};

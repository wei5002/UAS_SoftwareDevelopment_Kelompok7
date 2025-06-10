import express from "express";
import pesananController from "../controller/pesanan-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";         // pelanggan only
import { authBothMiddleware } from "../middleware/auth-both-middleware.js"; // pelanggan + admin
import { adminMiddleware } from "../middleware/admin-middleware.js";       // admin only

const router = new express.Router();

// GET → Pelanggan → /my → pesanan milik sendiri
router.get("/api/pesanan/my", authMiddleware, pesananController.getAll);

// GET → Admin → semua pesanan
router.get("/api/pesanan", adminMiddleware, pesananController.getAll);

// GET → Semua boleh lihat by ID (akses di kontrol service)
router.get("/api/pesanan/item/:id", authBothMiddleware, pesananController.getById);

// POST → Hanya pelanggan boleh membuat pesanan
router.post("/api/pesanan", authMiddleware, pesananController.create);

// PATCH → Boleh diakses oleh pelanggan dan admin
router.patch("/api/pesanan/:id", authBothMiddleware, pesananController.update);

// DELETE → Boleh diakses oleh pelanggan dan admin
router.delete("/api/pesanan/:id", authBothMiddleware, pesananController.remove);

export {
  router
};

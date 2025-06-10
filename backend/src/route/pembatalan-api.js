import express from "express";
import pembatalanController from "../controller/pembatalan-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";         // pelanggan only
import { authBothMiddleware } from "../middleware/auth-both-middleware.js"; // pelanggan + admin
import { adminMiddleware } from "../middleware/admin-middleware.js";       // admin only

const router = new express.Router();

// GET → Pelanggan → /my → pembatalan milik sendiri
router.get("/api/pembatalan/my", authMiddleware, pembatalanController.getAll);

// GET → Admin → semua pembatalan
router.get("/api/pembatalan", adminMiddleware, pembatalanController.getAll);

// GET → Semua boleh lihat by ID (akses dikontrol di service)
router.get("/api/pembatalan/item/:id", authBothMiddleware, pembatalanController.getById);

// POST → Hanya pelanggan boleh membuat pembatalan pesanan
router.post("/api/pembatalan", authMiddleware, pembatalanController.create);

// PATCH → Hanya admin yang boleh update pembatalan pesanan
router.patch("/api/pembatalan/:id", adminMiddleware, pembatalanController.update);

// DELETE → Pelanggan boleh membatalkan permintaan pembatalan jika masih 'menunggu'
//        → Admin boleh menghapus kapan saja
router.delete("/api/pembatalan/:id", authBothMiddleware, pembatalanController.remove);

export {
  router
};

import express from "express";
import laporanController from "../controller/laporan-controller.js";
import { adminMiddleware } from "../middleware/admin-middleware.js";

const router = new express.Router();

// GET → Admin → semua laporan penjualan (bisa difilter)
router.get("/api/laporan", adminMiddleware, laporanController.getAll);

// GET → Admin → detail laporan by ID
router.get("/api/laporan/:id", adminMiddleware, laporanController.getById);

export {
  router
};

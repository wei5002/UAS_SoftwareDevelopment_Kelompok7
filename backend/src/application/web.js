import express from "express";
import cors from "cors";

import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../route/public-api.js";
import { pelangganRouter } from "../route/pelanggan-api.js";
import { adminRouter } from "../route/admin-api.js";
import { router as produkRouter } from "../route/produk-api.js";
import { router as keranjangRouter } from "../route/keranjangBelanja-api.js";
import { router as pesananRouter } from "../route/pesanan-api.js";
import { router as pembatalanRouter } from "../route/pembatalan-api.js";
import { router as laporanRouter } from "../route/laporan-api.js";
import uploadRouter from "../route/upload-api.js";
import { uploadProdukRouter } from "../route/upload-produk-api.js";

export const web = express();

web.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

web.use(express.json());

// Public routes
web.use(publicRouter);

// Protected routes
web.use(uploadRouter);
web.use(uploadProdukRouter); // Gunakan router baru untuk gambar produk
web.use("/api/admin", adminRouter);
web.use("/api/pelanggan", pelangganRouter);
web.use(produkRouter);
web.use(keranjangRouter);
web.use(pesananRouter);
web.use(pembatalanRouter);
web.use(laporanRouter);

// ✅ Proxy API Wilayah Indonesia → supaya aman CORS
web.get("/proxy/provinces", async (req, res) => {
  const response = await fetch("https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json");
  const data = await response.json();
  res.json(data);
});

web.get("/proxy/regencies/:provinceId", async (req, res) => {
  const { provinceId } = req.params;
  const response = await fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
  const data = await response.json();
  res.json(data);
});

web.get("/proxy/districts/:regencyId", async (req, res) => {
  const { regencyId } = req.params;
  const response = await fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/districts/${regencyId}.json`);
  const data = await response.json();
  res.json(data);
});

web.get("/proxy/villages/:districtId", async (req, res) => {
  const { districtId } = req.params;
  const response = await fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/villages/${districtId}.json`);
  const data = await response.json();
  res.json(data);
});

web.use(errorMiddleware);

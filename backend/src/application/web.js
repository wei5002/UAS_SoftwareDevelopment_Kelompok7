import express from "express";
import cors from "cors"; // 🟢 Import CORS

import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../route/public-api.js";
import { pelangganRouter } from "../route/pelanggan-api.js";
import { adminRouter } from "../route/admin-api.js";
import { router as produkRouter } from "../route/produk-api.js";

export const web = express();

web.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));

web.use(express.json());

web.use(publicRouter);
web.use("/api/admin", adminRouter);
web.use("/api/pelanggan", pelangganRouter);
web.use(produkRouter);

web.use(errorMiddleware);

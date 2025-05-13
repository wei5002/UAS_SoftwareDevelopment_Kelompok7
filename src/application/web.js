import express from "express";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../route/public-api.js";
import { pelangganRouter } from "../route/pelanggan-api.js";
import { adminRouter } from "../route/admin-api.js";

export const web = express();
web.use(express.json());

web.use(publicRouter);
web.use("/api/admin", adminRouter);
web.use("/api/pelanggan", pelangganRouter);


web.use(errorMiddleware);

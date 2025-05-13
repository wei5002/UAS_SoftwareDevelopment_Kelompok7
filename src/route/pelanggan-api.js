import express from "express";
import pelangganController from "../controller/pelanggan-controller.js";

import {authMiddleware} from "../middleware/auth-middleware.js";

const pelangganRouter = new express.Router();
pelangganRouter.use(authMiddleware);

//USER API
pelangganRouter.delete('/logout', pelangganController.logout);

export {
    pelangganRouter
}
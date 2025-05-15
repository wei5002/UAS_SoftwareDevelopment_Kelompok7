import express from "express";
import pelangganController from "../controller/pelanggan-controller.js";
import adminController from "../controller/admin-controller.js";

const publicRouter = new express.Router();
publicRouter.post('/api/pelanggan/register', pelangganController.register);
publicRouter.post('/api/pelanggan/login', pelangganController.login);
publicRouter.post('/api/admin/register', adminController.register);
publicRouter.post('/api/admin/login', adminController.login);

export {
    publicRouter
}

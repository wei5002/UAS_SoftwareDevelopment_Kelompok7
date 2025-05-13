import express from "express";
import adminController from "../controller/admin-controller.js";
import { adminMiddleware } from "../middleware/admin-middleware.js";

const adminRouter = new express.Router();
adminRouter.use(adminMiddleware);

//USER API
adminRouter.delete('/logout', adminController.logout);  // Perbaiki ini, hilangkan '/api/admin' sebelum 'logout'

export {
    adminRouter
};

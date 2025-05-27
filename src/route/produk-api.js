import express from "express";
import produkController from "../controller/produk-controller.js";

const router = new express.Router();

router.get('/api/produk', produkController.getAll);
router.post('/api/produk', produkController.create);
router.put('/api/produk/:id', produkController.update);
router.delete('/api/produk/:id', produkController.remove);

export {
  router
};

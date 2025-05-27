import produkService from "../service/produk-service.js";

const getAll = async (req, res, next) => {
  try {
    const products = await produkService.getAll();
    res.status(200).json(products);
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const result = await produkService.create(req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await produkService.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    await produkService.remove(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

export default {
  getAll,
  create,
  update,
  remove
};

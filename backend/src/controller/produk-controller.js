import produkService from "../service/produk-service.js";

// Ambil semua produk (dengan query: search, kategori, page, limit)
const getAll = async (req, res, next) => {
  try {
    const result = await produkService.getAll(req.query);
    res.status(200).json({
      message: "Data produk berhasil diambil",
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

// Ambil detail produk berdasarkan ID
const getById = async (req, res, next) => {
  try {
    const produk = await produkService.getById(req.params.id);
    res.status(200).json({
      message: "Detail produk berhasil diambil",
      data: produk
    });
  } catch (error) {
    next(error);
  }
};

// Tambah produk baru
const create = async (req, res, next) => {
  try {
    const result = await produkService.create(req.body);
    res.status(201).json({
      message: "Produk berhasil ditambahkan",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Update produk
const update = async (req, res, next) => {
  try {
    const result = await produkService.update(req.params.id, req.body);
    res.status(200).json({
      message: "Produk berhasil diperbarui",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Hapus produk
const remove = async (req, res, next) => {
  try {
    await produkService.remove(req.params.id);
    res.status(200).json({
      message: "Produk berhasil dihapus"
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove
};

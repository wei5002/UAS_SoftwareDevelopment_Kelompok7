import pesananService from "../service/pesanan-service.js";

// Helper untuk ambil context user
const getUserContext = (req) => {
  return {
    userId: req.pelanggan ? req.pelanggan.id : null,
    isAdmin: req.admin ? true : false
  };
};

// Ambil semua pesanan (Pelanggan → my, Admin → all)
const getAll = async (req, res, next) => {
  try {
    const { userId, isAdmin } = getUserContext(req);

    const result = await pesananService.getAll(userId, isAdmin);
    res.status(200).json({
      message: "Data pesanan berhasil diambil",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Ambil detail pesanan berdasarkan ID
const getById = async (req, res, next) => {
  try {
    const pesananId = req.params.id;
    
    // Perbaikan: Fungsi getById di service hanya memerlukan ID pesanan.
    // Informasi user (untuk otorisasi) biasanya ditangani di middleware atau di dalam service jika diperlukan.
    const pesanan = await pesananService.getById(pesananId);

    res.status(200).json({
      message: "Detail pesanan berhasil diambil",
      data: pesanan
    });
  } catch (error) {
    next(error);
  }
};

// Tambah pesanan baru
const create = async (req, res, next) => {
  try {
    if (!req.pelanggan) {
      return res.status(403).json({
        errors: "Hanya pelanggan yang diizinkan membuat pesanan"
      });
    }

    const userId = req.pelanggan.id;

    const result = await pesananService.create(userId, req.body);
    res.status(201).json({
      message: "Pesanan berhasil dibuat",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Update pesanan
const update = async (req, res, next) => {
  try {
    const pesananId = req.params.id;
    const { userId, isAdmin } = getUserContext(req);

    // --- PERBAIKAN DI SINI ---
    // Urutan argumen disesuaikan dengan yang ada di pesanan-service.js
    // Urutan yang benar: (id, userId, isAdmin, request)
    const result = await pesananService.update(pesananId, userId, isAdmin, req.body);

    res.status(200).json({
      message: "Pesanan berhasil diperbarui",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Hapus pesanan
const remove = async (req, res, next) => {
  try {
    const pesananId = req.params.id;
    const { userId, isAdmin } = getUserContext(req);

    await pesananService.remove(pesananId, userId, isAdmin);

    res.status(200).json({
      message: "Pesanan berhasil dihapus"
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

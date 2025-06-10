import pembatalanService from "../service/pembatalan-service.js";

// Helper untuk ambil context user
const getUserContext = (req) => {
  return {
    userId: req.pelanggan ? req.pelanggan.id : null,
    isAdmin: req.admin ? true : false
  };
};

// Ambil semua pembatalan (Pelanggan → my, Admin → all)
const getAll = async (req, res, next) => {
  try {
    const { userId, isAdmin } = getUserContext(req);

    const result = await pembatalanService.getAll(userId, isAdmin);
    res.status(200).json({
      message: "Data pembatalan pesanan berhasil diambil",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Ambil detail pembatalan berdasarkan ID
const getById = async (req, res, next) => {
  try {
    const pembatalanId = req.params.id;
    const { userId, isAdmin } = getUserContext(req);

    const pembatalan = await pembatalanService.getById(pembatalanId, userId, isAdmin);

    res.status(200).json({
      message: "Detail pembatalan pesanan berhasil diambil",
      data: pembatalan
    });
  } catch (error) {
    next(error);
  }
};

// Tambah pembatalan baru
const create = async (req, res, next) => {
  try {
    if (!req.pelanggan) {
      return res.status(403).json({
        errors: "Hanya pelanggan yang diizinkan membuat pembatalan pesanan"
      });
    }

    const userId = req.pelanggan.id;

    const result = await pembatalanService.create(userId, req.body);
    res.status(201).json({
      message: "Pembatalan pesanan berhasil dibuat",
      data: result
    });
  } catch (error) {
    // Jika error karena pesanan sudah punya pembatalan → kasih message jelas
    if (error.status === 400 && error.message === "Pesanan ini sudah memiliki permintaan pembatalan") {
      return res.status(400).json({
        errors: "Pesanan ini sudah memiliki permintaan pembatalan. Anda tidak dapat mengajukan pembatalan lagi."
      });
    }

    next(error);
  }
};

// Update pembatalan pesanan (oleh Admin)
const update = async (req, res, next) => {
  try {
    const pembatalanId = req.params.id;
    const { userId, isAdmin } = getUserContext(req);

    const result = await pembatalanService.update(pembatalanId, req.body, userId, isAdmin);

    res.status(200).json({
      message: "Pembatalan pesanan berhasil diperbarui",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Hapus pembatalan pesanan
const remove = async (req, res, next) => {
  try {
    const pembatalanId = req.params.id;
    const { userId, isAdmin } = getUserContext(req);

    await pembatalanService.remove(pembatalanId, userId, isAdmin);

    res.status(200).json({
      message: "Pembatalan pesanan berhasil dihapus"
    });
  } catch (error) {
    // Jika pelanggan coba hapus status selain 'menunggu' → beri message enak
    if (error.status === 403 && error.message.includes("status masih 'menunggu'")) {
      return res.status(403).json({
        errors: "Anda hanya dapat membatalkan permintaan pembatalan saat status masih 'menunggu'."
      });
    }

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

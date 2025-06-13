import laporanService from "../service/laporan-service.js";

// Ambil semua laporan
const getAll = async (req, res, next) => {
  try {
    // ==================== PERBAIKAN DI SINI ====================
    // Mengirimkan seluruh object req.query ke service
    const result = await laporanService.getAll(req.query);
    // =========================================================

    res.status(200).json({
      message: "Data laporan penjualan berhasil diambil",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Ambil detail laporan berdasarkan ID
const getById = async (req, res, next) => {
  try {
    const laporanId = req.params.id;

    const laporan = await laporanService.getById(laporanId);

    res.status(200).json({
      message: "Detail laporan penjualan berhasil diambil",
      data: laporan
    });
  } catch (error) {
    next(error);
  }
};

// Tambah laporan baru
const create = async (req, res, next) => {
  try {
    // Hanya Admin yang boleh membuat laporan
    if (!req.admin) {
      return res.status(403).json({
        errors: "Hanya admin yang diizinkan membuat laporan penjualan"
      });
    }

    const result = await laporanService.create(req.body, req.admin.id); // adminId dipassing dari token

    res.status(201).json({
      message: "Laporan penjualan berhasil dibuat",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Update laporan
const update = async (req, res, next) => {
  try {
    // Hanya Admin yang boleh update laporan
    if (!req.admin) {
      return res.status(403).json({
        errors: "Hanya admin yang diizinkan mengubah laporan penjualan"
      });
    }

    const laporanId = req.params.id;

    const result = await laporanService.update(laporanId, req.body);

    res.status(200).json({
      message: "Laporan penjualan berhasil diperbarui",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Hapus laporan
const remove = async (req, res, next) => {
  try {
    // Hanya Admin yang boleh hapus laporan
    if (!req.admin) {
      return res.status(403).json({
        errors: "Hanya admin yang diizinkan menghapus laporan penjualan"
      });
    }

    const laporanId = req.params.id;

    await laporanService.remove(laporanId);

    res.status(200).json({
      message: "Laporan penjualan berhasil dihapus"
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

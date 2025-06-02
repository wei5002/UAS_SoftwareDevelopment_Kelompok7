import keranjangService from "../service/keranjangBelanja-service.js";

// Ambil semua item keranjang berdasarkan userId
const getAllByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Jika login sebagai pelanggan, batasi akses hanya ke datanya sendiri
    if (req.pelanggan && req.pelanggan.id !== userId) {
      return res.status(403).json({
        errors: "Pelanggan tidak diizinkan mengakses keranjang pengguna lain"
      });
    }

    const result = await keranjangService.getAllByUserId(userId);
    res.status(200).json({
      message: "Data keranjang berhasil diambil",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Ambil item keranjang berdasarkan ID
const getById = async (req, res, next) => {
  try {
    const item = await keranjangService.getById(req.params.id);

    // Jika login sebagai pelanggan, batasi akses ke item miliknya
    if (req.pelanggan && item.userId !== req.pelanggan.id) {
      return res.status(403).json({
        errors: "Pelanggan tidak diizinkan mengakses item keranjang ini"
      });
    }

    res.status(200).json({
      message: "Detail item keranjang berhasil diambil",
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// Tambah item ke keranjang
const create = async (req, res, next) => {
  try {
    const result = await keranjangService.create(req.body);
    res.status(201).json({
      message: "Item berhasil ditambahkan ke keranjang",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Update jumlah item (khusus)
const updateJumlah = async (req, res, next) => {
  try {
    const result = await keranjangService.updateJumlah(req.params.id, req.body.jumlah);
    res.status(200).json({
      message: "Jumlah item keranjang berhasil diperbarui",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Update spesifikasi item (jumlah, size, thickness, hole)
const updateSpesifikasi = async (req, res, next) => {
  try {
    const result = await keranjangService.updateSpesifikasi(req.params.id, req.body);
    res.status(200).json({
      message: "Spesifikasi item keranjang berhasil diperbarui",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Hapus item dari keranjang
const remove = async (req, res, next) => {
  try {
    await keranjangService.remove(req.params.id);
    res.status(200).json({
      message: "Item keranjang berhasil dihapus"
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllByUser,
  getById,
  create,
  updateJumlah,
  updateSpesifikasi,
  remove
};

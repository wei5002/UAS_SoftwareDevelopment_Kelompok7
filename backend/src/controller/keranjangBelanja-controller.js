import keranjangService from "../service/keranjangBelanja-service.js";
import { ResponseError } from "../error/response-error.js";

// Ambil semua item keranjang milik pelanggan yg login
const getAllByUser = async (req, res, next) => {
  try {
    const userId = req.pelanggan.id;

    const result = await keranjangService.getAllByUserId(userId);
    res.status(200).json({
      message: "Data keranjang berhasil diambil",
      data: result
    });
  } catch (error) {
    if (error instanceof ResponseError) {
      return res.status(error.status).json({
        errors: error.message
      });
    }
    console.error('Unexpected error getAllByUser:', error);
    next(error);
  }
};

// Ambil item keranjang berdasarkan ID
const getById = async (req, res, next) => {
  try {
    const item = await keranjangService.getById(req.params.id);

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
    if (error instanceof ResponseError) {
      return res.status(error.status).json({
        errors: error.message
      });
    }
    console.error('Unexpected error getById:', error);
    next(error);
  }
};

// Tambah item ke keranjang
const create = async (req, res, next) => {
  try {
    const result = await keranjangService.create({
      userId: req.pelanggan.id,
      produkVarianId: req.body.produkVarianId,
      jumlah: req.body.jumlah
    });
    res.status(201).json({
      message: "Item berhasil ditambahkan ke keranjang",
      data: result
    });
  } catch (error) {
    if (error instanceof ResponseError) {
      return res.status(error.status).json({
        errors: error.message
      });
    }
    console.error('Unexpected error create:', error);
    next(error);
  }
};

// Update jumlah item
const updateJumlah = async (req, res, next) => {
  try {
    const item = await keranjangService.getById(req.params.id);
    if (req.pelanggan && item.userId !== req.pelanggan.id) {
      return res.status(403).json({
        errors: "Pelanggan tidak diizinkan mengubah item keranjang ini"
      });
    }

    const result = await keranjangService.updateJumlah(req.params.id, req.body.jumlah);
    res.status(200).json({
      message: "Jumlah item keranjang berhasil diperbarui",
      data: result
    });
  } catch (error) {
    if (error instanceof ResponseError) {
      return res.status(error.status).json({
        errors: error.message
      });
    }
    console.error('Unexpected error updateJumlah:', error);
    next(error);
  }
};

// Update spesifikasi item
const updateSpesifikasi = async (req, res, next) => {
  try {
    const item = await keranjangService.getById(req.params.id);

    if (req.pelanggan && item.userId !== req.pelanggan.id) {
      return res.status(403).json({
        errors: "Pelanggan tidak diizinkan mengubah item keranjang ini"
      });
    }

    const result = await keranjangService.updateSpesifikasi(req.params.id, req.body);

    console.log('DEBUG result updateSpesifikasi:', result);

    res.status(200).json({
      message: "Spesifikasi item keranjang berhasil diperbarui",
      data: result
    });
  } catch (error) {
    if (error instanceof ResponseError) {
      return res.status(error.status).json({
        errors: error.message
      });
    }

    console.error('Unexpected error updateSpesifikasi:', error);

    return res.status(500).json({
      errors: error?.message || 'Internal Server Error'
    });
  }
};

// Hapus item dari keranjang
const remove = async (req, res, next) => {
  try {
    const item = await keranjangService.getById(req.params.id);
    if (req.pelanggan && item.userId !== req.pelanggan.id) {
      return res.status(403).json({
        errors: "Pelanggan tidak diizinkan menghapus item keranjang ini"
      });
    }

    await keranjangService.remove(req.params.id);
    res.status(200).json({
      message: "Item keranjang berhasil dihapus"
    });
  } catch (error) {
    if (error instanceof ResponseError) {
      return res.status(error.status).json({
        errors: error.message
      });
    }
    console.error('Unexpected error remove:', error);
    next(error);
  }
};

// Tandai item sebagai sudah diorder (dipanggil dari controller Pesanan)
const markAsOrdered = async (req, res, next) => {
  try {
    // Harus pakai ID valid
    const result = await keranjangService.markAsOrdered(req.params.id);

    res.status(200).json({
      message: "Item keranjang berhasil ditandai sebagai sudah diorder",
      data: result
    });
  } catch (error) {
    if (error instanceof ResponseError) {
      return res.status(error.status).json({
        errors: error.message
      });
    }
    console.error('Unexpected error markAsOrdered:', error);
    next(error);
  }
};

export default {
  getAllByUser,
  getById,
  create,
  updateJumlah,
  updateSpesifikasi,
  remove,
  markAsOrdered
};

import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createKeranjangValidation,
  getKeranjangIdValidation,
  updateKeranjangValidation
} from "../validation/keranjangBelanja-validation.js";

// Ambil semua item keranjang berdasarkan userId
const getAllByUserId = async (userId) => {
  const items = await prismaClient.keranjangBelanja.findMany({
    where: { 
      userId: userId,
      isOrdered: false // ✅ hanya ambil item yang belum diorder
    },
    include: {
      produkVarian: {
        include: {
          produk: true
        }
      }
    }
  });

  return items;
};

// Tambah item ke keranjang
const create = async (request) => {
  const data = validate(createKeranjangValidation, request);

  const produkVarian = await prismaClient.produkVarian.findUnique({
    where: { id: data.produkVarianId }
  });

  if (!produkVarian) {
    throw new ResponseError(404, "Produk varian tidak ditemukan");
  }

  const totalHarga = produkVarian.harga * (data.jumlah || 1);

  return prismaClient.keranjangBelanja.create({
    data: {
      userId: data.userId,
      produkVarianId: data.produkVarianId,
      jumlah: data.jumlah || 1,
      totalHarga: totalHarga
    },
    include: {
      produkVarian: {
        include: {
          produk: true
        }
      }
    }
  });
};

// Ambil satu item keranjang berdasarkan ID keranjang
const getById = async (id) => {
  const validId = validate(getKeranjangIdValidation, id);

  const item = await prismaClient.keranjangBelanja.findUnique({
    where: { id: validId },
    include: {
      produkVarian: {
        include: {
          produk: true
        }
      }
    }
  });

  if (!item) {
    throw new ResponseError(404, "Item keranjang tidak ditemukan");
  }

  return item;
};

// Update jumlah item + totalHarga (ambil harga produkVarian terkini)
const updateJumlah = async (id, jumlahBaru) => {
  const validId = validate(getKeranjangIdValidation, id);

  const item = await prismaClient.keranjangBelanja.findUnique({
    where: { id: validId },
    include: { produkVarian: true }
  });

  if (!item) {
    throw new ResponseError(404, "Item keranjang tidak ditemukan");
  }

  const produkVarian = await prismaClient.produkVarian.findUnique({
    where: { id: item.produkVarianId }
  });

  if (!produkVarian) {
    throw new ResponseError(404, "Produk varian tidak ditemukan");
  }

  const newTotalHarga = produkVarian.harga * jumlahBaru;

  return prismaClient.keranjangBelanja.update({
    where: { id: validId },
    data: {
      jumlah: jumlahBaru,
      totalHarga: newTotalHarga
    },
    include: {
      produkVarian: {
        include: {
          produk: true
        }
      }
    }
  });
};

// Update spesifikasi item (jumlah, size, thickness, hole) + update totalHarga
const updateSpesifikasi = async (id, request) => {
  const validId = validate(getKeranjangIdValidation, id);
  const data = validate(updateKeranjangValidation, request);

  const item = await prismaClient.keranjangBelanja.findUnique({
    where: { id: validId },
    include: {
      produkVarian: true
    }
  });

  if (!item) {
    throw new ResponseError(404, 'Item keranjang tidak ditemukan');
  }

  const produkId = item.produkVarian.produkId;

  // Debug log → supaya Anda bisa tracing jika kombinasi tidak valid
  console.log('DEBUG updateSpesifikasi', {
    produkId,
    size: data.size,
    thickness: data.thickness,
    hole: data.hole
  });

  const whereClause = {
    produkId: produkId
  };

  if (data.size !== undefined) whereClause.size = data.size;
  if (data.thickness !== undefined) whereClause.thickness = data.thickness;
  if (data.hole !== undefined) whereClause.hole = data.hole;

  const produkVarian = await prismaClient.produkVarian.findFirst({
    where: whereClause
  });

  if (!produkVarian) {
    throw new ResponseError(404, 'Produk varian dengan spesifikasi tersebut tidak ditemukan');
  }

  const totalHargaBaru = produkVarian.harga * (data.jumlah ?? item.jumlah);

  const updatedItem = await prismaClient.keranjangBelanja.update({
    where: { id: validId },
    data: {
      produkVarianId: produkVarian.id,
      jumlah: data.jumlah ?? item.jumlah,
      totalHarga: totalHargaBaru
    },
    include: {
      produkVarian: {
        include: {
          produk: true
        }
      }
    }
  });

  return updatedItem;
};

// Hapus item dari keranjang (digunakan untuk tombol delete manual)
const remove = async (id) => {
  const validId = validate(getKeranjangIdValidation, id);

  const item = await prismaClient.keranjangBelanja.findUnique({
    where: { id: validId }
  });

  if (!item) {
    throw new ResponseError(404, "Item keranjang tidak ditemukan");
  }

  return prismaClient.keranjangBelanja.delete({
    where: { id: validId }
  });
};

// Tandai item sebagai sudah diorder (dipanggil dari controller Pesanan)
const markAsOrdered = async (id) => {
  const validId = validate(getKeranjangIdValidation, id);

  const item = await prismaClient.keranjangBelanja.findUnique({
    where: { id: validId }
  });

  if (!item) {
    throw new ResponseError(404, "Item keranjang tidak ditemukan");
  }

  return prismaClient.keranjangBelanja.update({
    where: { id: validId },
    data: {
      isOrdered: true
    }
  });
};

export default {
  getAllByUserId,
  create,
  getById,
  updateJumlah,
  updateSpesifikasi,
  remove,
  markAsOrdered // ✅ export fungsi baru
};

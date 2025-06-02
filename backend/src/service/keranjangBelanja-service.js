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
  const validUserId = validate(getKeranjangIdValidation, userId);

  const items = await prismaClient.keranjangBelanja.findMany({
    where: { userId: validUserId },
    include: {
      produk: true
    }
  });

  return items;
};

// Tambah item ke keranjang
const create = async (request) => {
  const data = validate(createKeranjangValidation, request);

  return prismaClient.keranjangBelanja.create({
    data: {
      userId: data.userId,
      produkId: data.produkId,
      jumlah: data.jumlah || 1,
      size: data.size || null,
      thickness: data.thickness || null,
      hole: data.hole || null
    }
  });
};

// Ambil satu item keranjang berdasarkan ID keranjang
const getById = async (id) => {
  const validId = validate(getKeranjangIdValidation, id);

  const item = await prismaClient.keranjangBelanja.findUnique({
    where: { id: validId },
    include: {
      produk: true
    }
  });

  if (!item) {
    throw new ResponseError(404, "Item keranjang tidak ditemukan");
  }

  return item;
};

// Update hanya jumlah item
const updateJumlah = async (id, jumlahBaru) => {
  const validId = validate(getKeranjangIdValidation, id);

  const item = await prismaClient.keranjangBelanja.findUnique({
    where: { id: validId }
  });

  if (!item) {
    throw new ResponseError(404, "Item keranjang tidak ditemukan");
  }

  return prismaClient.keranjangBelanja.update({
    where: { id: validId },
    data: { jumlah: jumlahBaru }
  });
};

// ✅ Update spesifikasi (jumlah, size, thickness, hole)
const updateSpesifikasi = async (id, request) => {
  const validId = validate(getKeranjangIdValidation, id);
  const data = validate(updateKeranjangValidation, request);

  const item = await prismaClient.keranjangBelanja.findUnique({
    where: { id: validId }
  });

  if (!item) {
    throw new ResponseError(404, "Item keranjang tidak ditemukan");
  }

  return prismaClient.keranjangBelanja.update({
    where: { id: validId },
    data: {
      jumlah: data.jumlah ?? item.jumlah,
      size: data.size ?? item.size,
      thickness: data.thickness ?? item.thickness,
      hole: data.hole ?? item.hole
    }
  });
};

// Hapus item dari keranjang
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

export default {
  getAllByUserId,
  create,
  getById,
  updateJumlah,
  updateSpesifikasi,
  remove
};

import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createProdukValidation,
  getProdukValidation
} from "../validation/produk-validation.js";

// Ambil semua produk
const getAll = async (query) => {
  const {
    kategori,
    search,
    page = 1,
    limit = 10
  } = query;

  const filters = {};

  if (kategori) {
    filters.kategori = kategori;
  }

  if (search) {
    filters.namaProduk = {
      contains: search,
      mode: 'insensitive'
    };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [data, total] = await Promise.all([
    prismaClient.produk.findMany({
      where: filters,
      skip,
      take,
      orderBy: { namaProduk: 'asc' }
    }),
    prismaClient.produk.count({
      where: filters
    })
  ]);

  return {
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};


// Ambil produk berdasarkan ID
const getById = async (id) => {
  const produkId = validate(getProdukValidation, id);

  const produk = await prismaClient.produk.findUnique({
    where: { id: produkId }
  });

  if (!produk) {
    throw new ResponseError(404, "Produk tidak ditemukan");
  }

  return produk;
};

// Tambah produk
const create = async (request) => {
  const data = validate(createProdukValidation, request);

  return prismaClient.produk.create({
    data: {
      namaProduk: data.namaProduk,
      kategori: data.kategori || undefined,
      harga: data.harga,
      stok: data.stok,
      thickness: data.thickness || [],
      hole: data.hole || [],
      size: data.size || [],
      gambar: data.gambar || null
    }
  });
};

// Update produk
const update = async (id, request) => {
  const produkId = validate(getProdukValidation, id);

  const existing = await prismaClient.produk.findUnique({
    where: { id: produkId }
  });

  if (!existing) {
    throw new ResponseError(404, "Produk tidak ditemukan");
  }

  return prismaClient.produk.update({
    where: { id: produkId },
    data: {
      namaProduk: request.namaProduk,
      kategori: request.kategori || undefined,
      harga: request.harga,
      stok: request.stok,
      thickness: request.thickness || [],
      hole: request.hole || [],
      size: request.size || [],
      gambar: request.gambar || null
    }
  });
};

// Hapus produk
const remove = async (id) => {
  const produkId = validate(getProdukValidation, id);

  const existing = await prismaClient.produk.findUnique({
    where: { id: produkId }
  });

  if (!existing) {
    throw new ResponseError(404, "Produk tidak ditemukan");
  }

  return prismaClient.produk.delete({
    where: { id: produkId }
  });
};

export default {
  getAll,
  getById,
  create,
  update,
  remove
};

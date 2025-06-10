import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createProdukValidation,
  getProdukValidation
} from "../validation/produk-validation.js";

// Ambil semua produk dengan filter dan paginasi
const getAll = async (query) => {
  const { kategori, search } = query;
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

  const data = await prismaClient.produk.findMany({
    where: filters,
    orderBy: { namaProduk: 'asc' },
    include: {
      varian: true
    }
  });

  return {
    data
  };
};

// Ambil satu produk berdasarkan ID
const getById = async (id) => {
  const produkId = validate(getProdukValidation, id);

  const produk = await prismaClient.produk.findUnique({
    where: { id: produkId },
    include: {
      varian: true
    }
  });

  if (!produk) {
    throw new ResponseError(404, "Produk tidak ditemukan");
  }

  return produk;
};

// Tambah produk baru + variannya
const create = async (request) => {
  const data = validate(createProdukValidation, request);

  return prismaClient.produk.create({
    data: {
      namaProduk: data.namaProduk,
      kategori: data.kategori,
      gambar: data.gambar || null,
      varian: {
        create: data.varian.map((v) => ({
          size: v.size || null,
          thickness: v.thickness != null ? v.thickness : null,
          hole: v.hole != null ? v.hole : null,
          harga: v.harga,
          stok: v.stok
        }))
      }
    },
    include: {
      varian: true
    }
  });
};

// Update produk + update / create / hapus varian
const update = async (id, request) => {
  const produkId = validate(getProdukValidation, id);

  const existing = await prismaClient.produk.findUnique({
    where: { id: produkId },
    include: { varian: true }
  });

  if (!existing) {
    throw new ResponseError(404, "Produk tidak ditemukan");
  }

  const dataUpdate = validate(createProdukValidation, request);

  // Step 1: Tentukan ID varian yang dikirim user
  const inputVarianIds = dataUpdate.varian
    .filter(v => v.id)
    .map(v => v.id);

  // Step 2: Hapus varian lama yang tidak ada di input
  const existingVarianIds = existing.varian.map(v => v.id);
  const varianIdsToDelete = existingVarianIds.filter(id => !inputVarianIds.includes(id));

  // Step 3: Buat transaksi
  const transaction = [];

  // Update produk dulu
  transaction.push(
    prismaClient.produk.update({
      where: { id: produkId },
      data: {
        namaProduk: dataUpdate.namaProduk,
        kategori: dataUpdate.kategori,
        gambar: dataUpdate.gambar || null
      }
    })
  );

  // Hapus varian lama (jika ada yang perlu dihapus)
  if (varianIdsToDelete.length > 0) {
    transaction.push(
      prismaClient.produkVarian.deleteMany({
        where: {
          id: { in: varianIdsToDelete }
        }
      })
    );
  }

  // Update varian yang sudah ada (punya ID)
  dataUpdate.varian
    .filter(v => v.id)
    .forEach(v => {
      transaction.push(
        prismaClient.produkVarian.update({
          where: { id: v.id },
          data: {
            size: v.size || null,
            thickness: v.thickness != null ? v.thickness : null,
            hole: v.hole != null ? v.hole : null,
            harga: v.harga,
            stok: v.stok
          }
        })
      );
    });

  // Create varian baru (tanpa ID)
  const newVarianData = dataUpdate.varian
    .filter(v => !v.id)
    .map(v => ({
      produkId: produkId,
      size: v.size || null,
      thickness: v.thickness != null ? v.thickness : null,
      hole: v.hole != null ? v.hole : null,
      harga: v.harga,
      stok: v.stok
    }));

  if (newVarianData.length > 0) {
    transaction.push(
      prismaClient.produkVarian.createMany({
        data: newVarianData
      })
    );
  }

  // Jalankan semua query dalam 1 transaksi
  await prismaClient.$transaction(transaction);

  // Ambil data produk terbaru + variannya
  const updatedProduk = await prismaClient.produk.findUnique({
    where: { id: produkId },
    include: {
      varian: true
    }
  });

  return updatedProduk;
};

// Hapus produk + seluruh variannya
const remove = async (id) => {
  const produkId = validate(getProdukValidation, id);

  const existing = await prismaClient.produk.findUnique({
    where: { id: produkId }
  });

  if (!existing) {
    throw new ResponseError(404, "Produk tidak ditemukan");
  }

  // Hapus semua varian terlebih dahulu
  await prismaClient.produkVarian.deleteMany({
    where: { produkId: produkId }
  });

  // Hapus produk
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

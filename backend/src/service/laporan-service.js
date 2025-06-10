import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createLaporanValidation,
  getLaporanIdValidation,
  updateLaporanValidation
} from "../validation/laporan-validation.js";

// Ambil semua laporan
// Ambil semua laporan (support filter month & year)
const getAll = async (month, year) => {
  const whereClause = {};

  // Jika ada filter month & year
  if (month && year) {
    const parsedMonth = parseInt(month);
    const parsedYear = parseInt(year);

    // Validasi month & year sederhana
    if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      throw new ResponseError(400, "Parameter 'month' harus antara 1-12");
    }

    if (isNaN(parsedYear) || parsedYear < 2000) {
      throw new ResponseError(400, "Parameter 'year' tidak valid");
    }

    const startDate = new Date(parsedYear, parsedMonth - 1, 1);
    const endDate = new Date(parsedYear, parsedMonth, 1);

    whereClause.tanggalLaporan = {
      gte: startDate,
      lt: endDate
    };
  }

  const laporan = await prismaClient.laporanPenjualan.findMany({
    where: whereClause,
    include: {
      pesanan: true,
      admin: true
    }
  });

  return laporan;
};

// Tambah laporan baru
const create = async (request, adminId) => {
  const data = validate(createLaporanValidation, request);

  return prismaClient.laporanPenjualan.create({
    data: {
      tanggalLaporan: data.tanggalLaporan,
      pesananId: data.pesananId,
      totalPenjualan: data.totalPenjualan,
      adminId: adminId,
      keterangan: data.keterangan
    },
    include: {
      pesanan: true,
      admin: true
    }
  });
};

// Ambil satu laporan berdasarkan ID
const getById = async (id) => {
  const validId = validate(getLaporanIdValidation, id);

  const laporan = await prismaClient.laporanPenjualan.findUnique({
    where: { id: validId },
    include: {
      pesanan: true,
      admin: true
    }
  });

  if (!laporan) {
    throw new ResponseError(404, "Laporan penjualan tidak ditemukan");
  }

  return laporan;
};

// Update laporan
const update = async (id, request) => {
  const validId = validate(getLaporanIdValidation, id);
  const data = validate(updateLaporanValidation, request);

  const laporan = await prismaClient.laporanPenjualan.findUnique({
    where: { id: validId }
  });

  if (!laporan) {
    throw new ResponseError(404, "Laporan penjualan tidak ditemukan");
  }

  return prismaClient.laporanPenjualan.update({
    where: { id: validId },
    data: {
      totalPenjualan: data.totalPenjualan ?? laporan.totalPenjualan,
      keterangan: data.keterangan ?? laporan.keterangan
    },
    include: {
      pesanan: true,
      admin: true
    }
  });
};

// Hapus laporan
const remove = async (id) => {
  const validId = validate(getLaporanIdValidation, id);

  const laporan = await prismaClient.laporanPenjualan.findUnique({
    where: { id: validId }
  });

  if (!laporan) {
    throw new ResponseError(404, "Laporan penjualan tidak ditemukan");
  }

  return prismaClient.laporanPenjualan.delete({
    where: { id: validId }
  });
};

export default {
  getAll,
  create,
  getById,
  update,
  remove
};

import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createLaporanValidation,
  getLaporanIdValidation,
  updateLaporanValidation
} from "../validation/laporan-validation.js";

// Ambil semua laporan
const getAll = async (requestQuery) => {
  const { month, year } = requestQuery;
  const whereClause = {};

  if (year) {
    const parsedYear = parseInt(year);
    if (isNaN(parsedYear) || parsedYear < 2000) {
      throw new ResponseError(400, "Parameter 'year' tidak valid");
    }

    const startDate = new Date(parsedYear, 0, 1); // Awal tahun
    const endDate = new Date(parsedYear + 1, 0, 1); // Awal tahun berikutnya

    whereClause.tanggalLaporan = {
      gte: startDate,
      lt: endDate,
    };
    
    // Jika bulan juga disertakan
    if (month) {
        const parsedMonth = parseInt(month);
         if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
          throw new ResponseError(400, "Parameter 'month' harus antara 1-12");
        }
        const monthStartDate = new Date(parsedYear, parsedMonth - 1, 1);
        const monthEndDate = new Date(parsedYear, parsedMonth, 1);
        
        whereClause.tanggalLaporan = {
            gte: monthStartDate,
            lt: monthEndDate
        };
    }
  }
  
  // ==================== PERBAIKAN UTAMA DI SINI ====================
  // Menambahkan nested include untuk mengambil semua data relasional
  const laporan = await prismaClient.laporanPenjualan.findMany({
    where: whereClause,
    include: {
      admin: true, // Optional, jika butuh info admin
      pesanan: {
        include: {
          user: {
            select: { // Hanya ambil data yang diperlukan
              id: true,
              nama: true
            }
          },
          keranjang: {
            include: {
              produkVarian: {
                include: {
                  produk: {
                    select: {
                      id: true,
                      namaProduk: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  // ================================================================

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
    // Pastikan include juga lengkap di sini jika diperlukan
    include: {
      pesanan: {
        include: {
          user: true,
          keranjang: { include: { produkVarian: { include: { produk: true } } } }
        }
      }
    }
  });
};

// Ambil satu laporan berdasarkan ID
const getById = async (id) => {
  const validId = validate(getLaporanIdValidation, id);

  const laporan = await prismaClient.laporanPenjualan.findUnique({
    where: { id: validId },
    // Pastikan include juga lengkap di sini
    include: {
      pesanan: {
        include: {
          user: true,
          keranjang: { include: { produkVarian: { include: { produk: true } } } }
        }
      }
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
    // Pastikan include juga lengkap di sini
    include: {
       pesanan: {
        include: {
          user: true,
          keranjang: { include: { produkVarian: { include: { produk: true } } } }
        }
      }
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

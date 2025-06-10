import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createPesananValidation,
  getPesananIdValidation,
  updatePesananValidation
} from "../validation/pesanan-validation.js";

// ... (fungsi getAll dan getById tidak berubah)
const getAll = async (userId, isAdmin) => {
  const whereClause = isAdmin ? {} : { userId };

  const pesanan = await prismaClient.pesanan.findMany({
    where: whereClause,
    include: {
      keranjang: {
        include: {
          produkVarian: {
            include: {
              produk: true
            }
          }
        }
      },
      user: true,
      pembatalanPesanan: true,
    },
    orderBy: {
        tanggalPemesanan: 'desc'
    }
  });

  return pesanan;
};

const getById = async (id) => {
    const validId = validate(getPesananIdValidation, id);

    const pesanan = await prismaClient.pesanan.findUnique({
        where: { id: validId },
        include: {
            keranjang: {
                include: {
                    produkVarian: {
                        include: {
                            produk: true
                        }
                    }
                }
            },
            user: true,
            pembatalanPesanan: true,
        }
    });

    if (!pesanan) {
        throw new ResponseError(404, "Pesanan tidak ditemukan");
    }

    return pesanan;
};

// --- FUNGSI CREATE DIPERBAIKI ---
const create = async (userId, request) => {
  const data = validate(createPesananValidation, request);

  const keranjang = await prismaClient.keranjangBelanja.findFirst({
      where: {
          id: data.keranjangId,
          userId: userId
      }
  });

  if (!keranjang) {
      throw new ResponseError(404, "Keranjang belanja tidak ditemukan atau bukan milik Anda.");
  }

  // Menyimpan data pesanan, termasuk ongkosKirim
  return prismaClient.pesanan.create({
    data: {
      userId: userId,
      status: data.status,
      ongkosKirim: data.ongkosKirim, // Menyimpan ongkos kirim
      alamatDetail: data.alamatDetail,
      provinsi: data.provinsi,
      kabupaten: data.kabupaten,
      kecamatan: data.kecamatan,
      kelurahan: data.kelurahan,
      nomorTelepon: data.nomorTelepon,
      keranjangId: data.keranjangId,
      bankName: data.bankName,
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      buktiTransferUrl: data.buktiTransferUrl
    }
  });
};

// --- FUNGSI UPDATE DIPERBAIKI ---
const update = async (id, userId, isAdmin, request) => {
  const data = validate(updatePesananValidation, request);
  const validId = validate(getPesananIdValidation, id);

  const pesanan = await prismaClient.pesanan.findUnique({
    where: { id: validId }
  });

  if (!pesanan) throw new ResponseError(404, "Pesanan tidak ditemukan");
  if (!isAdmin && pesanan.userId !== userId) throw new ResponseError(403, "Anda tidak diizinkan mengubah pesanan ini.");
  if (!isAdmin && data.status) {
    if (!(pesanan.status === 'ON_DELIVERY' && data.status === 'DONE')) {
      throw new ResponseError(403, "Anda hanya dapat menyelesaikan pesanan yang sedang dalam pengiriman.");
    }
  }

  const updatedPesanan = await prismaClient.pesanan.update({
    where: { id: validId },
    data: data,
    include: {
      keranjang: true,
    }
  });

  if (updatedPesanan.status === 'DONE') {
    const existingLaporan = await prismaClient.laporanPenjualan.findFirst({
      where: { pesananId: updatedPesanan.id }
    });

    if (!existingLaporan) {
      // Menjumlahkan total harga produk dengan ongkos kirim untuk laporan
      const totalPenjualanAkhir = updatedPesanan.keranjang.totalHarga + (updatedPesanan.ongkosKirim || 0);

      await prismaClient.laporanPenjualan.create({
        data: {
          pesananId: updatedPesanan.id,
          totalPenjualan: totalPenjualanAkhir,
          keterangan: "Laporan dibuat otomatis oleh sistem."
        }
      });
    }
  }

  return updatedPesanan;
};

// ... (fungsi remove tidak berubah)
const remove = async (id, userId, isAdmin) => {
  const validId = validate(getPesananIdValidation, id);
  const pesanan = await prismaClient.pesanan.findUnique({ where: { id: validId } });
  if (!pesanan) throw new ResponseError(404, "Pesanan tidak ditemukan");
  if (!isAdmin && pesanan.userId !== userId) throw new ResponseError(403, "Anda tidak diizinkan menghapus pesanan ini");
  return prismaClient.pesanan.delete({ where: { id: validId } });
};


export default {
  getAll,
  getById,
  create,
  update,
  remove
};

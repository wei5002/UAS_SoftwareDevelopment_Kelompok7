import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createPesananValidation,
  getPesananIdValidation,
  updatePesananValidation
} from "../validation/pesanan-validation.js";

// GET ALL
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

  // Filter agar hanya pesanan dengan produk yang valid
  return pesanan.filter(p =>
    p.keranjang &&
    p.keranjang.produkVarian &&
    p.keranjang.produkVarian.produk
  );
};

// GET BY ID
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

  if (!pesanan || !pesanan.keranjang || !pesanan.keranjang.produkVarian || !pesanan.keranjang.produkVarian.produk) {
    throw new ResponseError(404, "Pesanan atau produk terkait tidak ditemukan");
  }

  return pesanan;
};

// CREATE
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

  return prismaClient.pesanan.create({
    data: {
      userId: userId,
      status: data.status,
      ongkosKirim: data.ongkosKirim,
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

// UPDATE
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

  // Hanya update field yang ada pada request, termasuk alasanPenolakan (opsional)
  const updateData = { ...data };

  const updatedPesanan = await prismaClient.pesanan.update({
    where: { id: validId },
    data: updateData,
    include: {
      keranjang: true,
    }
  });

  // Buat laporan penjualan otomatis jika status jadi DONE
  if (updatedPesanan.status === 'DONE') {
    const existingLaporan = await prismaClient.laporanPenjualan.findFirst({
      where: { pesananId: updatedPesanan.id }
    });

    if (!existingLaporan) {
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

// REMOVE
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

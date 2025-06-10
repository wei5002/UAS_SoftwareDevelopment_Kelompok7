import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createPembatalanValidation,
  getPembatalanIdValidation,
  updatePembatalanValidation
} from "../validation/pembatalan-validation.js";

// Ambil semua pembatalan pesanan
const getAll = async (userId, isAdmin) => {
  const whereClause = isAdmin ? {} : { userId };

  const pembatalan = await prismaClient.pembatalanPesanan.findMany({
    where: whereClause,
    include: {
      pesanan: true
    }
  });

  return pembatalan;
};

// Tambah pembatalan pesanan baru (hanya customer)
const create = async (userId, request) => {
  const data = validate(createPembatalanValidation, request);

  // Validasi: pastikan pesananId memang milik userId
  const pesanan = await prismaClient.pesanan.findUnique({
    where: { id: data.pesananId }
  });

  if (!pesanan) {
    throw new ResponseError(404, "Pesanan tidak ditemukan");
  }

  if (pesanan.userId !== userId) {
    throw new ResponseError(403, "Anda tidak dapat membatalkan pesanan milik pelanggan lain");
  }

  // Validasi: pastikan pesanan belum punya PembatalanPesanan
  const existingPembatalan = await prismaClient.pembatalanPesanan.findUnique({
    where: { pesananId: data.pesananId }
  });

  if (existingPembatalan) {
    throw new ResponseError(400, "Pesanan ini sudah memiliki permintaan pembatalan");
  }

  // FINAL create → cukup isi relasi pakai `connect`, tanpa `pesananId` dan `userId`
  return prismaClient.pembatalanPesanan.create({
    data: {
      alasanPembatalan: data.alasanPembatalan,
      tanggalPengajuan: data.tanggalPengajuan,
      statusPembatalan: "menunggu",
      tanggalDirespon: null,
      catatanAdmin: "",
      refundStatus: "belum_diproses",
      jumlahRefund: 0,
      pesanan: { connect: { id: data.pesananId } },
      user: { connect: { id: userId } }
    }
  });
};


// Ambil satu pembatalan berdasarkan ID
const getById = async (id, userId, isAdmin) => {
  const validId = validate(getPembatalanIdValidation, id);

  const pembatalan = await prismaClient.pembatalanPesanan.findUnique({
    where: { id: validId },
    include: {
      pesanan: true
    }
  });

  if (!pembatalan) {
    throw new ResponseError(404, "Pembatalan pesanan tidak ditemukan");
  }

  if (!isAdmin && pembatalan.userId !== userId) {
    throw new ResponseError(403, "Anda tidak memiliki akses ke pembatalan ini");
  }

  return pembatalan;
};

// Update pembatalan pesanan (hanya admin)
const update = async (id, request, userId, isAdmin) => {
  const validId = validate(getPembatalanIdValidation, id);
  const data = validate(updatePembatalanValidation, request);

  const pembatalan = await prismaClient.pembatalanPesanan.findUnique({
    where: { id: validId }
  });

  if (!pembatalan) {
    throw new ResponseError(404, "Pembatalan pesanan tidak ditemukan");
  }

  // Jika bukan admin, tidak boleh update
  if (!isAdmin) {
    throw new ResponseError(403, "Hanya admin yang dapat mengupdate pembatalan pesanan");
  }

  // Logic update aman:
  let updatedRefundStatus = pembatalan.refundStatus;
  let updatedJumlahRefund = pembatalan.jumlahRefund;

  if (data.statusPembatalan === "ditolak") {
    updatedRefundStatus = "belum_diproses";
    updatedJumlahRefund = 0;
  }

  if (data.statusPembatalan === "disetujui") {
    if (data.refundStatus === undefined || data.jumlahRefund === undefined) {
      throw new ResponseError(400, "Jika status disetujui, refundStatus dan jumlahRefund wajib diisi");
    }

    updatedRefundStatus = data.refundStatus;
    updatedJumlahRefund = data.jumlahRefund;
  }

  return prismaClient.pembatalanPesanan.update({
    where: { id: validId },
    data: {
      statusPembatalan: data.statusPembatalan ?? pembatalan.statusPembatalan,
      tanggalDirespon: data.tanggalDirespon ?? pembatalan.tanggalDirespon,
      catatanAdmin: data.catatanAdmin ?? pembatalan.catatanAdmin,
      refundStatus: updatedRefundStatus,
      jumlahRefund: updatedJumlahRefund
    }
  });
};

// Hapus pembatalan pesanan
const remove = async (id, userId, isAdmin) => {
  const validId = validate(getPembatalanIdValidation, id);

  const pembatalan = await prismaClient.pembatalanPesanan.findUnique({
    where: { id: validId }
  });

  if (!pembatalan) {
    throw new ResponseError(404, "Pembatalan pesanan tidak ditemukan");
  }

  if (!isAdmin && pembatalan.userId !== userId) {
    throw new ResponseError(403, "Anda tidak memiliki akses untuk menghapus pembatalan ini");
  }

  // Pelanggan hanya boleh hapus jika status masih 'menunggu'
  if (!isAdmin && pembatalan.statusPembatalan !== "menunggu") {
    throw new ResponseError(403, "Anda hanya dapat membatalkan permintaan pembatalan saat status masih 'menunggu'");
  }

  return prismaClient.pembatalanPesanan.delete({
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

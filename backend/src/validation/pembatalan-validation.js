// Validasi untuk PembatalanPesanan
import Joi from "joi";

// ENUM sesuai schema
const allowedStatusPembatalan = ["menunggu", "disetujui", "ditolak"];
const allowedRefundStatus = ["belum_diproses", "diproses", "selesai"];

// Validasi untuk create PembatalanPesanan (diawali oleh Pelanggan)
const createPembatalanValidation = Joi.object({
  alasanPembatalan: Joi.string()
    .max(255)
    .required()
    .messages({
      'string.base': "Alasan pembatalan harus berupa string",
      'string.max': "Alasan pembatalan maksimal 255 karakter",
      'any.required': "Alasan pembatalan wajib diisi",
    }),

  tanggalPengajuan: Joi.date()
    .required()
    .messages({
      'date.base': "Tanggal pengajuan harus berupa tanggal",
      'any.required': "Tanggal pengajuan wajib diisi",
    }),

  pesananId: Joi.string()
    .length(24)
    .required()
    .messages({
      'string.base': "Pesanan ID harus berupa string",
      'string.length': "Pesanan ID harus 24 karakter (ObjectId)",
      'any.required': "Pesanan ID wajib diisi",
    }),
});

// Validasi untuk update PembatalanPesanan (oleh Admin → update status + refund)
const updatePembatalanValidation = Joi.object({
  statusPembatalan: Joi.string()
    .valid(...allowedStatusPembatalan)
    .optional()
    .messages({
      'string.base': "Status pembatalan harus berupa string",
      'any.only': `Status pembatalan hanya boleh salah satu dari: ${allowedStatusPembatalan.join(", ")}`,
    }),

  tanggalDirespon: Joi.date()
    .optional()
    .messages({
      'date.base': "Tanggal direspon harus berupa tanggal",
    }),

  catatanAdmin: Joi.string()
    .max(255)
    .optional()
    .messages({
      'string.base': "Catatan admin harus berupa string",
      'string.max': "Catatan admin maksimal 255 karakter",
    }),

  refundStatus: Joi.string()
    .valid(...allowedRefundStatus)
    .optional()
    .messages({
      'string.base': "Status refund harus berupa string",
      'any.only': `Status refund hanya boleh salah satu dari: ${allowedRefundStatus.join(", ")}`,
    }),

  jumlahRefund: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': "Jumlah refund harus berupa angka",
      'number.min': "Jumlah refund minimal 0",
    }),
});

// Validasi untuk get PembatalanPesanan by ID
const getPembatalanIdValidation = Joi.string()
  .length(24)
  .required()
  .messages({
    'string.base': "ID harus berupa string",
    'string.length': "ID harus 24 karakter (ObjectId)",
    'any.required': "ID wajib diisi",
  });

export {
  createPembatalanValidation,
  updatePembatalanValidation,
  getPembatalanIdValidation
};

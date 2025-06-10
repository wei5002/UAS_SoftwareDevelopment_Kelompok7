// Validasi untuk LaporanPenjualan
import Joi from "joi";

// Validasi untuk membuat LaporanPenjualan
const createLaporanValidation = Joi.object({
  tanggalLaporan: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.base': "Tanggal laporan harus berupa tanggal",
      'date.format': "Tanggal laporan harus dalam format ISO (YYYY-MM-DDTHH:mm:ss.sssZ)",
    }),

  pesananId: Joi.string()
    .length(24)
    .required()
    .messages({
      'string.base': "Pesanan ID harus berupa string",
      'string.length': "Pesanan ID harus 24 karakter (ObjectId)",
      'any.required': "Pesanan ID wajib diisi",
    }),

  totalPenjualan: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': "Total penjualan harus berupa angka",
      'number.positive': "Total penjualan harus bernilai positif",
      'any.required': "Total penjualan wajib diisi",
    }),

  keterangan: Joi.string()
    .max(255)
    .optional()
    .messages({
      'string.base': "Keterangan harus berupa string",
      'string.max': "Keterangan maksimal 255 karakter",
    }),
});

// Validasi untuk update LaporanPenjualan (misalnya update totalPenjualan atau keterangan)
const updateLaporanValidation = Joi.object({
  totalPenjualan: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': "Total penjualan harus berupa angka",
      'number.positive': "Total penjualan harus bernilai positif",
    }),

  keterangan: Joi.string()
    .max(255)
    .optional()
    .messages({
      'string.base': "Keterangan harus berupa string",
      'string.max': "Keterangan maksimal 255 karakter",
    }),
});

// Validasi untuk get laporan berdasarkan ID
const getLaporanIdValidation = Joi.string()
  .length(24)
  .required()
  .messages({
    'string.base': "ID harus berupa string",
    'string.length': "ID harus 24 karakter (ObjectId)",
    'any.required': "ID wajib diisi",
  });

export {
  createLaporanValidation,
  updateLaporanValidation,
  getLaporanIdValidation
};

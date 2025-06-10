import Joi from "joi";

// ENUM untuk status pesanan, dipisahkan untuk keamanan
const allowedCreateStatus = ["PENDING"];
const allowedUpdateStatus = ["PENDING", "ON_PROCESS", "ON_DELIVERY", "DONE", "CANCELLED"];

// Validasi untuk membuat pesanan baru
const createPesananValidation = Joi.object({
  status: Joi.string()
    .valid(...allowedCreateStatus)
    .required()
    .messages({
      'string.base': "Status harus berupa string",
      'any.only': `Status pembuatan hanya boleh: ${allowedCreateStatus.join(", ")}`,
      'any.required': "Status wajib diisi",
    }),

  // --- TAMBAHKAN VALIDASI UNTUK ONGKOS KIRIM ---
  ongkosKirim: Joi.number()
    .min(0)
    .optional()
    .messages({
        'number.base': "Ongkos kirim harus berupa angka",
        'number.min': "Ongkos kirim tidak boleh negatif"
    }),

  alamatDetail: Joi.string()
    .required()
    .messages({
      'string.base': "Alamat detail harus berupa string",
      'any.required': "Alamat detail wajib diisi",
    }),

  provinsi: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.base': "Provinsi harus berupa string",
      'any.required': "Provinsi wajib diisi",
    }),

  kabupaten: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.base': "Kabupaten harus berupa string",
      'any.required': "Kabupaten wajib diisi",
    }),

  kecamatan: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.base': "Kecamatan harus berupa string",
      'any.required': "Kecamatan wajib diisi",
    }),

  kelurahan: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.base': "Kelurahan harus berupa string",
      'any.required': "Kelurahan wajib diisi",
    }),

  nomorTelepon: Joi.string()
    .max(255)
    .required()
    .messages({
      'string.base': "Nomor telepon harus berupa string",
      'any.required': "Nomor telepon wajib diisi",
    }),

  keranjangId: Joi.string()
    .length(24)
    .required()
    .messages({
      'string.base': "Keranjang ID harus berupa string",
      'string.length': "Keranjang ID harus 24 karakter (ObjectId)",
      'any.required': "Keranjang ID wajib diisi",
    }),

  bankName: Joi.string()
    .required()
    .messages({
      'string.base': "Nama bank harus berupa string",
      'any.required': "Nama bank wajib diisi",
    }),

  accountName: Joi.string()
    .required()
    .messages({
      'string.base': "Nama pemilik rekening harus berupa string",
      'any.required': "Nama pemilik rekening wajib diisi",
    }),

  accountNumber: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': "Nomor rekening harus berupa angka",
      'number.integer': "Nomor rekening harus berupa bilangan bulat",
      'any.required': "Nomor rekening wajib diisi",
    }),

  buktiTransferUrl: Joi.string()
    .uri()
    .required()
    .messages({
      'string.base': "Bukti transfer harus berupa string (URL)",
      'string.uri': "Bukti transfer harus berupa URL yang valid",
      'any.required': "Bukti transfer wajib diisi",
    }),
});

// Validasi untuk memperbarui pesanan
const updatePesananValidation = Joi.object({
  status: Joi.string()
    .valid(...allowedUpdateStatus)
    .optional()
    .messages({
      'string.base': "Status harus berupa string",
      'any.only': `Status hanya boleh salah satu dari: ${allowedUpdateStatus.join(", ")}`,
    }),
  
  ongkosKirim: Joi.number().min(0).optional(), // Juga tambahkan di sini jika perlu diupdate

  alamatDetail: Joi.string().optional().messages({ 'string.base': "Alamat detail harus berupa string" }),
  provinsi: Joi.string().max(100).optional().messages({ 'string.base': "Provinsi harus berupa string" }),
  kabupaten: Joi.string().max(100).optional().messages({ 'string.base': "Kabupaten harus berupa string" }),
  kecamatan: Joi.string().max(100).optional().messages({ 'string.base': "Kecamatan harus berupa string" }),
  kelurahan: Joi.string().max(100).optional().messages({ 'string.base': "Kelurahan harus berupa string" }),
  nomorTelepon: Joi.string().optional().messages({ 'string.base': "Nomor telepon harus berupa string" }),
  bankName: Joi.string().optional().messages({ 'string.base': "Nama bank harus berupa string" }),
  accountName: Joi.string().optional().messages({ 'string.base': "Nama pemilik rekening harus berupa string" }),
  accountNumber: Joi.number().integer().optional().messages({ 'number.base': "Nomor rekening harus berupa angka" }),
  buktiTransferUrl: Joi.string().uri().optional().messages({ 'string.uri': "Bukti transfer harus berupa URL yang valid" }),
});

// Validasi untuk mendapatkan pesanan berdasarkan ID
const getPesananIdValidation = Joi.string()
  .length(24)
  .required()
  .messages({
    'string.base': "ID harus berupa string",
    'string.length': "ID harus 24 karakter (ObjectId)",
    'any.required': "ID wajib diisi",
  });

export {
  createPesananValidation,
  updatePesananValidation,
  getPesananIdValidation
};

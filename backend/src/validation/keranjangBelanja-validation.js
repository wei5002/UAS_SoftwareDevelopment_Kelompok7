import Joi from "joi";

// Validasi untuk membuat item keranjang belanja
const createKeranjangValidation = Joi.object({
  userId: Joi.string()
    .length(24)
    .required()
    .messages({
      'string.base': "User ID harus berupa string",
      'string.length': "User ID harus 24 karakter (ObjectId)",
      'any.required': "User ID wajib diisi",
    }),

  produkId: Joi.string()
    .length(24)
    .required()
    .messages({
      'string.base': "Produk ID harus berupa string",
      'string.length': "Produk ID harus 24 karakter (ObjectId)",
      'any.required': "Produk ID wajib diisi",
    }),

  jumlah: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': "Jumlah harus berupa angka",
      'number.integer': "Jumlah harus berupa bilangan bulat",
      'number.min': "Jumlah minimal 1",
    }),

  size: Joi.string()
    .max(50)
    .optional()
    .messages({
      'string.base': "Size harus berupa string",
      'string.max': "Size maksimal 50 karakter",
    }),

  thickness: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': "Thickness harus berupa angka",
      'number.positive': "Thickness harus bernilai positif"
    }),

  hole: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': "Hole harus berupa angka",
      'number.positive': "Hole harus bernilai positif"
    }),
});

// Validasi untuk mengupdate spesifikasi pesanan
const updateKeranjangValidation = Joi.object({
  jumlah: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.base': "Jumlah harus berupa angka",
      'number.integer': "Jumlah harus bilangan bulat",
      'number.min': "Jumlah minimal 1",
    }),

  size: Joi.string()
    .max(50)
    .optional()
    .messages({
      'string.base': "Size harus berupa string",
      'string.max': "Size maksimal 50 karakter"
    }),

  thickness: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': "Thickness harus berupa angka",
      'number.positive': "Thickness harus bernilai positif"
    }),

  hole: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': "Hole harus berupa angka",
      'number.positive': "Hole harus bernilai positif"
    }),
});

// Validasi untuk mendapatkan item keranjang berdasarkan ID
const getKeranjangIdValidation = Joi.string()
  .length(24)
  .required()
  .messages({
    'string.base': "ID harus berupa string",
    'string.length': "ID harus 24 karakter (ObjectId)",
    'any.required': "ID wajib diisi",
  });

export {
  createKeranjangValidation,
  updateKeranjangValidation,
  getKeranjangIdValidation
};

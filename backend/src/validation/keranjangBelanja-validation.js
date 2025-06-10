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

  produkVarianId: Joi.string()
    .length(24)
    .required()
    .messages({
      'string.base': "Produk Varian ID harus berupa string",
      'string.length': "Produk Varian ID harus 24 karakter (ObjectId)",
      'any.required': "Produk Varian ID wajib diisi",
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

  totalHarga: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': "Total Harga harus berupa angka",
      'number.positive': "Total Harga harus bernilai positif"
    }),
});

// Validasi untuk mengupdate item keranjang belanja
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
    .min(0)
    .optional()
    .messages({
      'number.base': "Thickness harus berupa angka",
      'number.min': "Thickness minimal 0 (boleh tidak ada)"
    }),

  hole: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': "Hole harus berupa angka",
      'number.min': "Hole minimal 0 (boleh tidak ada)"
    }),

  isOrdered: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': "isOrdered harus berupa boolean"
    })
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

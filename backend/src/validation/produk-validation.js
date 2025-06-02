import Joi from "joi";

// Daftar enum kategori numerik sebagai string
const kategoriEnum = ["201", "304", "316"];

// Validasi untuk menambahkan produk
const createProdukValidation = Joi.object({
    namaProduk: Joi.string()
        .max(100)
        .required()
        .messages({
            'string.base': "Nama produk harus berupa string",
            'string.max': "Nama produk maksimal 100 karakter",
            'any.required': "Nama produk wajib diisi",
        }),

    kategori: Joi.string()
        .valid(...kategoriEnum)
        .required()
        .messages({
            'string.base': "Kategori harus berupa string",
            'any.only': `Kategori hanya boleh salah satu dari: ${kategoriEnum.join(", ")}`,
            'any.required': "Kategori wajib diisi"
        }),

    harga: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': "Harga harus berupa angka",
            'number.positive': "Harga harus bernilai positif",
            'any.required': "Harga wajib diisi",
        }),

    stok: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': "Stok harus berupa angka",
            'number.integer': "Stok harus berupa bilangan bulat",
            'number.min': "Stok tidak boleh negatif",
            'any.required': "Stok wajib diisi",
        }),

    thickness: Joi.array()
        .items(
            Joi.number().positive().messages({
                'number.base': "Setiap nilai thickness harus berupa angka",
                'number.positive': "Thickness harus bernilai positif"
            })
        )
        .optional(),

    hole: Joi.array()
        .items(
            Joi.number().positive().messages({
                'number.base': "Setiap nilai hole harus berupa angka",
                'number.positive': "Hole harus bernilai positif"
            })
        )
        .optional(),

    size: Joi.array()
        .items(
            Joi.string().max(50).messages({
                'string.base': "Setiap nilai size harus berupa string",
                'string.max': "Size maksimal 50 karakter"
            })
        )
        .optional(),

    gambar: Joi.string()
        .uri()
        .optional()
        .messages({
            'string.base': "Gambar harus berupa string",
            'string.uri': "Gambar harus berupa URL yang valid",
        }),
});

// Validasi untuk mengambil produk berdasarkan ID
const getProdukValidation = Joi.string()
    .length(24)
    .required()
    .messages({
        'string.base': "ID produk harus berupa string",
        'string.length': "ID produk harus 24 karakter (ObjectId)",
        'any.required': "ID produk wajib diisi",
    });

export {
    createProdukValidation,
    getProdukValidation
};

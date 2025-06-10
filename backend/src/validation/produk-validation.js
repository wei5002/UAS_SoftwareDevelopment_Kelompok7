import Joi from "joi";

// Daftar enum kategori numerik sebagai string
const kategoriEnum = ["201", "304", "316"];

// Validasi untuk menambahkan Produk + array varian
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

    gambar: Joi.string()
        .uri()
        .optional()
        .messages({
            'string.base': "Gambar harus berupa string",
            'string.uri': "Gambar harus berupa URL yang valid",
        }),

    // Validasi untuk array varian
    varian: Joi.array().items(
        Joi.object({
            id: Joi.string()
                .length(24)
                .optional()
                .messages({
                    'string.base': "ID varian harus berupa string",
                    'string.length': "ID varian harus 24 karakter (ObjectId)"
                }),
            
            // --- PERBAIKAN DI SINI ---
            // Izinkan 'produKId' ada saat update, karena data diambil dari database
            produkId: Joi.string()
                .length(24)
                .optional()
                .messages({
                    'string.base': "ID produk harus berupa string",
                    'string.length': "ID produk harus 24 karakter (ObjectId)"
                }),

            size: Joi.string()
                .max(50)
                .allow(null, '') // nullable
                .optional()
                .messages({
                    'string.base': "Size harus berupa string",
                    'string.max': "Size maksimal 50 karakter",
                }),

            thickness: Joi.number()
                .positive()
                .allow(null) // nullable
                .optional()
                .messages({
                    'number.base': "Thickness harus berupa angka",
                    'number.positive': "Thickness harus bernilai positif",
                }),

            hole: Joi.number()
                .min(0)
                .allow(null) // nullable
                .optional()
                .messages({
                    'number.base': "Hole harus berupa angka",
                    'number.min': "Hole minimal 0",
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
        })
    ).min(1).required().messages({
        'array.base': "Varian harus berupa array",
        'array.min': "Minimal harus ada 1 varian produk",
        'any.required': "Varian produk wajib diisi"
    })
});

// Validasi untuk menambahkan ProdukVarian secara terpisah
const createProdukVarianValidation = Joi.object({
    produkId: Joi.string()
        .length(24)
        .required()
        .messages({
            'string.base': "ID Produk harus berupa string",
            'string.length': "ID Produk harus 24 karakter (ObjectId)",
            'any.required': "ID Produk wajib diisi",
        }),

    size: Joi.string()
        .max(50)
        .allow(null, '') // nullable
        .optional()
        .messages({
            'string.base': "Size harus berupa string",
            'string.max': "Size maksimal 50 karakter",
        }),

    thickness: Joi.number()
        .positive()
        .allow(null) // nullable
        .optional()
        .messages({
            'number.base': "Thickness harus berupa angka",
            'number.positive': "Thickness harus bernilai positif",
        }),

    hole: Joi.number()
        .min(0)
        .allow(null) // nullable
        .optional()
        .messages({
            'number.base': "Hole harus berupa angka",
            'number.min': "Hole minimal 0",
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
});

// Validasi untuk mengambil Produk berdasarkan ID
const getProdukValidation = Joi.string()
    .length(24)
    .required()
    .messages({
        'string.base': "ID produk harus berupa string",
        'string.length': "ID produk harus 24 karakter (ObjectId)",
        'any.required': "ID produk wajib diisi",
    });

// Validasi untuk mengambil ProdukVarian berdasarkan ID
const getProdukVarianValidation = Joi.string()
    .length(24)
    .required()
    .messages({
        'string.base': "ID varian produk harus berupa string",
        'string.length': "ID varian produk harus 24 karakter (ObjectId)",
        'any.required': "ID varian produk wajib diisi",
    });

export {
    createProdukValidation,
    createProdukVarianValidation,
    getProdukValidation,
    getProdukVarianValidation
};

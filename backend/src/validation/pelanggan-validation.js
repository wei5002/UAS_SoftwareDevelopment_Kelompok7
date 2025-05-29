import Joi from "joi";

// Validasi untuk registrasi user
const registerPelangganValidation = Joi.object({
    email: Joi.string()
        .email()            
        .required()
        .messages({
            'string.base': "email harus berupa string",
            'string.email': "email harus dalam format yang valid",
            'any.required': "email wajib diisi",
        }),

    password: Joi.string()
        .min(8)            
        .max(100)          
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|<>?;:,.~]*$'))
        .messages({
            'string.base': "password harus berupa string",
            'string.min': "password minimal 8 karakter",
            'string.max': "password maksimal 100 karakter",
            'string.pattern.base': "password hanya boleh mengandung huruf, angka, dan karakter khusus",
            'any.required': "password wajib diisi",
        }),

    nama: Joi.string()
        .max(100)
        .required()
        .messages({
            'string.base': "nama harus berupa string",
            'string.max': "nama maksimal 100 karakter",
            'any.required': "nama wajib diisi",
        })
});

// Validasi untuk login user
const loginPelangganValidation = Joi.object({
    email: Joi.string()
        .email()            
        .required()
        .messages({
            'string.base': "email harus berupa string",
            'string.email': "email harus dalam format yang valid",
            'any.required': "email wajib diisi",
        }),

    password: Joi.string()
        .min(8)             
        .max(100)           
        .required()
        .messages({
            'string.base': "password harus berupa string",
            'string.min': "password minimal 8 karakter",
            'string.max': "password maksimal 100 karakter",
            'any.required': "password wajib diisi",
        })
});

const getPelangganValidation = Joi.string().max(100).required();

export {
    registerPelangganValidation,
    loginPelangganValidation,
    getPelangganValidation
};

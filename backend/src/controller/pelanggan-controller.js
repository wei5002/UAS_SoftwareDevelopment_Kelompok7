import pelangganService from "../service/pelanggan-service.js";

// Controller register
const register = async (req, res, next) => {
    try {
        const request = req.body;
        const result = await pelangganService.register(request); // Menggunakan pelangganService
        res.status(201).json({
            message: "Pelanggan berhasil terdaftar",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

// Controller login
const login = async (req, res, next) => {
    try {
        const request = req.body;
        const result = await pelangganService.login(request); // Menggunakan pelangganService
        res.status(200).json({
            message: "Login berhasil",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {
        await pelangganService.logout(req.pelanggan.email);
        res.status(200).json({
            data: "Logout berhasil"
        });
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    login,
    logout
}

import adminService from "../service/admin-service.js";

const register = async (req, res, next) => {
    try {
        const request = req.body;
        const result = await adminService.register(request);
        res.status(201).json({
            message: "Admin berhasil terdaftar",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const request = req.body;
        const result = await adminService.login(request);
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
        await adminService.logout(req.admin.username);
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
import { prismaClient } from "../application/database.js";

export const authMiddleware = async (req, res, next) => {
    let token = req.get('Authorization');
    if (!token) {
        return res.status(401).json({
            errors: "Unauthorized"
        });
    }

    // Remove 'Bearer ' from token
    token = token.replace('Bearer ', '');

    const pelanggan = await prismaClient.pelanggan.findFirst({
        where: {
            token: token
        }
    });

    if (!pelanggan) {
        return res.status(401).json({
            errors: "Unauthorized"
        });
    }

    req.pelanggan = pelanggan;
    next();
}

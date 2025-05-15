// admin-middleware.js

import { prismaClient } from "../application/database.js";

export const adminMiddleware = async (req, res, next) => {
    let token = req.get('Authorization');
    if (!token) {
        return res.status(401).json({
            errors: "Unauthorized"
        });
    }

    // Remove 'Bearer ' from token if present
    token = token.replace('Bearer ', '');

    // Ensure token is checked against the 'admin' collection
    const admin = await prismaClient.admin.findFirst({
        where: {
            token: token
        }
    });

    if (!admin) {
        return res.status(401).json({
            errors: "Unauthorized"
        });
    }

    req.admin = admin; // passing the admin to the request
    next();
};

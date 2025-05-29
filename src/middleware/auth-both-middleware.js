import { prismaClient } from "../application/database.js";

export const authBothMiddleware = async (req, res, next) => {
  let token = req.get("Authorization");
  if (!token) {
    return res.status(401).json({
      errors: "Unauthorized",
    });
  }

  token = token.replace("Bearer ", "");

  // Cek apakah token milik pelanggan
  const pelanggan = await prismaClient.pelanggan.findFirst({
    where: { token: token },
  });

  if (pelanggan) {
    req.pelanggan = pelanggan;
    return next();
  }

  // Cek apakah token milik admin
  const admin = await prismaClient.admin.findFirst({
    where: { token: token },
  });

  if (admin) {
    req.admin = admin;
    return next();
  }

  return res.status(401).json({
    errors: "Unauthorized",
  });
};

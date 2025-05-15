import { validate } from "../validation/validation.js";
import {
  registerPelangganValidation,
  loginPelangganValidation,
  getPelangganValidation
} from "../validation/pelanggan-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
  const pelanggan = validate(registerPelangganValidation, request);

  const existing = await prismaClient.pelanggan.findUnique({
    where: {
      email: pelanggan.email
    }
  });

  if (existing) {
    throw new ResponseError(400, "Email telah digunakan");
  }

  const hashedPassword = await bcrypt.hash(pelanggan.password, 10);

  return prismaClient.pelanggan.create({
    data: {
      nama: pelanggan.nama,
      email: pelanggan.email,
      password: hashedPassword
    },
    select: {
      id: true,
      nama: true,
      email: true
    }
  });
};

const login = async (request) => {
  const loginRequest = validate(loginPelangganValidation, request);

  const pelanggan = await prismaClient.pelanggan.findUnique({
    where: {
      email: loginRequest.email
    }
  });

  if (!pelanggan) {
    throw new ResponseError(401, "Email atau password salah");
  }

  const isPasswordValid = await bcrypt.compare(loginRequest.password, pelanggan.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, "Email atau password salah");
  }

  const token = uuid().toString();
  const updated = await prismaClient.pelanggan.update({
    data: {
      token
    },
    where: {
      email: pelanggan.email
    },
    select: {
      token: true
    }
  });
  
  return {
    token: updated.token,        
    nama: pelanggan.nama,
    email: pelanggan.email
  };
  
};

const logout = async (email) => {
  email = validate(getPelangganValidation, email);

  const pelanggan = await prismaClient.pelanggan.findUnique({
      where: {
          email: email
      }
  });

  if (!pelanggan) {
      throw new ResponseError(404, "Pelanggan tidak ditemukan");
  }

  return prismaClient.pelanggan.update({
      where: {
          email: email
      },
      data: {
          token: null
      },
      select: {
          email: true
      }
  })
}

export default {
  register,
  login,
  logout
};

import { validate } from "../validation/validation.js";
import {
    getAdminValidation,
    loginAdminValidation,
    registerAdminValidation
} from "../validation/admin-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
  const admin = validate(registerAdminValidation, request);

  const existing = await prismaClient.admin.findUnique({
    where: {
      username: admin.username
    }
  });

  if (existing) {
    throw new ResponseError(400, "Username telah digunakan");
  }

  const hashedPassword = await bcrypt.hash(admin.password, 10);

  return prismaClient.admin.create({
    data: {
      username: admin.username,
      password: hashedPassword
    },
    select: {
      id: true,
      username: true
    }
  });
};

const login = async (request) => {
  const loginRequest = validate(loginAdminValidation, request);

  const admin = await prismaClient.admin.findUnique({
    where: {
      username: loginRequest.username
    }
  });

  if (!admin) {
    throw new ResponseError(401, "username atau password salah");
  }

  const isPasswordValid = await bcrypt.compare(loginRequest.password, admin.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, "username atau password salah");
  }

  const token = uuid().toString();
  const updated = await prismaClient.admin.update({
    data: {
      token
    },
    where: {
      username: admin.username
    },
    select: {
      token: true
    }
  });
  
  return {
    token: updated.token,        
    nama: admin.nama,
    username: admin.username
  };
  
};

const logout = async (username) => {
  username = validate(getAdminValidation, username);

  const admin = await prismaClient.admin.findUnique({
      where: {
          username: username
      }
  });

  if (!admin) {
      throw new ResponseError(404, "Admin tidak ditemukan");
  }

  return prismaClient.admin.update({
      where: {
          username: username
      },
      data: {
          token: null
      },
      select: {
          username: true
      }
  })
}

export default {
    register,
    login,
    logout
}
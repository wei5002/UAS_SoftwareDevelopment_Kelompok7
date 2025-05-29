import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const getAll = async () => {
  return prismaClient.produk.findMany();
};

const create = async (data) => {
  if (!data.namaProduk || !data.gambar || typeof data.harga !== 'number') {
  throw new ResponseError(400, "Field 'namaProduk', 'gambar', dan 'harga' wajib diisi dan valid.");
}

  return prismaClient.produk.create({ data });
};


const update = async (id, data) => {
  return prismaClient.produk.update({
    where: { id },
    data
  });
};

const remove = async (id) => {
  return prismaClient.produk.delete({
    where: { id }
  });
};

export default {
  getAll,
  create,
  update,
  remove
};

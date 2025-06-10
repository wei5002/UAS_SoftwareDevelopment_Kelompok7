import { imagekit } from "../../imagekit.config.js";

export const uploadBuktiTransfer = async (req, res, next) => {
  try {
    const file = req.file;
    const nama = req.body.nama;

    if (!file || !nama) {
      return res.status(400).json({ error: "Nama dan file gambar wajib diisi" });
    }

    const timestamp = Date.now();
    const ext = file.originalname.split('.').pop();
    const fileName = `${nama}-${timestamp}.${ext}`;

    const uploadResult = await imagekit.upload({
      file: file.buffer,
      fileName: fileName,
      folder: "upload-dasar",
    });

    return res.status(200).json({
      message: "Upload berhasil",
      data: {
        nama,
        gambar: uploadResult.url,
      },
    });
  } catch (error) {
    console.error("Error upload:", error.message);
    return res.status(500).json({ error: "Terjadi kesalahan saat upload" });
  }
};

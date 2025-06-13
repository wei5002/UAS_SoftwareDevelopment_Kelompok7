import { imagekit } from "../../imagekit.config.js";

// Controller untuk mengunggah gambar produk
export const uploadProdukImage = async (req, res, next) => {
  try {
    const file = req.file;
    // Revisi 4: Ambil nama produk dari body request
    const namaProduk = req.body.namaProduk; 

    if (!file) {
      return res.status(400).json({ errors: "File gambar tidak ditemukan." });
    }
    // Validasi tambahan untuk nama produk
    if (!namaProduk) {
      return res.status(400).json({ errors: "Nama produk wajib disertakan saat mengunggah gambar." });
    }

    const timestamp = Date.now();
    const ext = file.originalname.split('.').pop();
    // Revisi 4: Gunakan nama produk untuk nama file, ganti spasi dengan tanda hubung
    const fileName = `${namaProduk.replace(/\s+/g, '-')}-${timestamp}.${ext}`;

    const uploadResult = await imagekit.upload({
      file: file.buffer,
      fileName: fileName,
      folder: "gambar-produk", // Folder di ImageKit
    });

    // Kirim kembali URL gambar yang berhasil diunggah
    return res.status(200).json({
      message: "Unggah gambar produk berhasil",
      url: uploadResult.url,
    });

  } catch (error) {
    console.error("Error saat unggah gambar produk:", error.message);
    return res.status(500).json({ 
      errors: "Terjadi kesalahan pada server saat mengunggah gambar."
    });
  }
};



---

# UAS Software Development - Kelompok 7

Proyek ini merupakan tugas akhir dari mata kuliah Software Development. Aplikasi ini mencakup backend menggunakan **Node.js + Express + Prisma + MongoDB**, serta frontend menggunakan **Next.js (App Router)**.

Semua perintah dijalankan dari direktori **root** proyek untuk kemudahan.

---

## ▶️ Setup & Menjalankan Proyek

Hanya butuh 3 langkah mudah untuk menjalankan keseluruhan aplikasi.

### Langkah 1: Konfigurasi Environment

Salin file `.env.example` di dalam folder `backend` menjadi `.env`.

```bash
cp backend/.env.example backend/.env
```

Kemudian, buka file `backend/.env` tersebut dan isi `DATABASE_URL` dengan koneksi string MongoDB Atlas Anda.

```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/Digisteels?retryWrites=true&w=majority"
```

### Langkah 2: Instalasi Dependensi

Cukup jalankan satu perintah ini dari direktori root. Perintah ini akan menginstal dependensi untuk `backend` dan `frontend`, sekaligus menjalankan `prisma generate` secara otomatis.

```bash
npm run install:all
```

### Langkah 3: Jalankan Aplikasi

Untuk menjalankan server backend dan frontend secara bersamaan, gunakan perintah ini:

```bash
npm start
```

> Aplikasi frontend akan berjalan di `http://localhost:3000` dan backend akan berjalan di port yang berbeda.

---

## 🔧 Perintah Tambahan

### Regenerasi Prisma Client

Jika Anda mengubah file `schema.prisma`, Anda tidak perlu instalasi ulang. Cukup jalankan perintah ini dari root untuk memperbarui Prisma Client:

```bash
npm run prisma:generate
```

---

## 🧪 Testing API

Gunakan ekstensi **Thunder Client** (VS Code) atau aplikasi seperti **Postman** untuk menguji API yang berjalan di backend. Endpoint yang tersedia mencakup:

* Register/Login Pelanggan & Admin
* Produk CRUD
* Logout, dll.

---

## 🗂 Struktur Proyek

```
UAS_SoftwareDevelopment_Kelompok7/
├── backend/         # Express.js + Prisma + MongoDB
├── frontend/        # Next.js (App Router)
├── package.json     # Pusat kendali skrip
└── README.md
```

---

# UAS Software Development - Kelompok 7

Proyek ini merupakan tugas akhir dari mata kuliah Software Development. Aplikasi ini mencakup backend menggunakan **Node.js + Express + Prisma + MongoDB**, serta frontend menggunakan **Next.js (App Router)**.


## 📥 Clone Repository

```bash
git clone https://github.com/wei5002/UAS_SoftwareDevelopment_Kelompok7.git
cd UAS_SoftwareDevelopment_Kelompok7
````

---

## 🔧 Install Dependencies

### 1. Backend

```bash
cd backend
npm install
npx prisma generate
```

### 2. Frontend

```bash
cd ../frontend
npm install
```

---

## ⚙️ Konfigurasi Environment

Salin dan sesuaikan file `.env` di folder backend:

```bash
cp backend/.env.example backend/.env
```

Isi `DATABASE_URL` Anda:

```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/Digisteels?retryWrites=true&w=majority"
```

---

## ▶️ Menjalankan Aplikasi

Cukup satu perintah:

```bash
cd frontend
npm run dev
```

> Perintah di atas akan:
>
> * Menjalankan backend (`npm start` di folder backend)
> * Menjalankan frontend (`next dev` di folder frontend)

---

## 🧪 Testing API

Gunakan ekstensi **Thunder Client** (VS Code) atau aplikasi seperti **Postman** untuk menguji API:

* Register/Login Pelanggan & Admin
* Produk CRUD
* Logout, dll

---

## 🗂 Struktur Proyek

```
UAS_SoftwareDevelopment_Kelompok7/
├── backend/         # Express.js + Prisma + MongoDB
│   ├── controller/
│   ├── service/
│   ├── validation/
│   ├── middleware/
│   ├── application/
│   ├── main.js
│   └── .env
│
├── frontend/        # Next.js (App Router)
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── styles/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## ⚠️ Catatan Penting

* Backend berjalan di port `3000`, frontend di `3001` (default Next.js dev server)
* Jangan lupa menjalankan `npx prisma generate` jika mengubah `schema.prisma`
* Middleware `cors` sudah aktif agar backend dapat diakses dari frontend
* Pastikan file `.env` Anda benar dan terkoneksi ke MongoDB Atlas
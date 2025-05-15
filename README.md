# UAS Software Development Kelompok 7

Ini adalah proyek UAS untuk mata kuliah Software Development yang dikembangkan oleh Kelompok 7. Aplikasi ini menggunakan Node.js, Express, Prisma, dan MongoDB.

---

## Langkah Instalasi dan Menjalankan Aplikasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/UAS_SoftwareDevelopment_Kelompok7.git
   ```

2. **Masuk ke Direktori Proyek**
   ```bash
   cd UAS_SoftwareDevelopment_Kelompok7
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Salin File `.env`**
   ```bash
   cp .env.example .env
   ```

5. **Konfigurasi Environment**
   Edit file `.env` dan pastikan konfigurasi berikut sudah sesuai:
   ```env
   DATABASE_URL="mongodb+srv://purnomoht17:<db_password>@cluster0.gqddkdw.mongodb.net/Digisteels?retryWrites=true&w=majority"
   ```
   Ganti `purnomoht17` dengan username MongoDB Anda.
   Ganti `<db_password>` dengan password MongoDB Anda.

6. **Jalankan Aplikasi**
   ```bash
   npm start
   ```

7. **Pengujian**
   Untuk pengujian menyeluruh, kita perlu menunggu integrasi dari tim frontend.

---

## Menambahkan Model pada Prisma Schema

1. **Edit File `schema.prisma`**
   Tambahkan model baru, misalnya:
   ```prisma
   model Product {
     id          String   @id @default(auto()) @map("_id") @test.ObjectId
     name        String
     description String?
     price       Float
     createdAt   DateTime @default(now())
   }
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

---

## Dokumentasi Pengujian Endpoint (`test.http`)

Kami menggunakan file `test.http` untuk menguji endpoint API dengan cepat dan efisien menggunakan REST Client (di ekstensi VS Code).

### 📌 **REGISTER Pelanggan**
```http
POST http://localhost:3000/api/pelanggan/register
Content-Type: application/json
Accept: application/json

{
  "email": "Heru@example.com",
  "password": "Herupurnomo17.",
  "name": "Heru Purnomo"
}
```

### 🔑 **LOGIN Pelanggan**
```http
POST http://localhost:3000/api/pelanggan/login
Content-Type: application/json
Accept: application/json

{
  "email": "Heru@example.com",
  "password": "Herupurnomo17."
}
```
**Token:** `1f2c79f8-40ce-40e2-86f4-8b29bc8704ba`

### 🚪 **LOGOUT Pelanggan**
```http
DELETE http://localhost:3000/api/pelanggan/logout
Content-Type: application/json
Accept: application/json
Authorization: 85b65db9-217e-4470-b398-66504a0c98ba

### 👨‍💼 **REGISTER Admin**
```http
POST http://localhost:3000/api/admin/register
Content-Type: application/json
Accept: application/json

{
  "username": "admin_heru",
  "password": "Herupurnomo17."
}
```

### 🔐 **LOGIN Admin**
```http
POST http://localhost:3000/api/admin/login
Content-Type: application/json
Accept: application/json

{
  "username": "admin_heru",
  "password": "Herupurnomo17."
}
```

### 🚪 **LOGOUT Admin**
```http
DELETE http://localhost:3000/api/pelanggan/logout
Content-Type: application/json
Accept: application/json
Authorization: 85b65db9-217e-4470-b398-66504a0c98ba
```

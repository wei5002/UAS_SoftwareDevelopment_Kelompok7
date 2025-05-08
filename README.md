# UAS_SoftwareDevelopment_Kelompok7

Ini adalah aplikasi backend untuk UAS Software Development Kelompok 7. Aplikasi ini menggunakan Express.js dan MongoDB untuk membangun API yang dapat digunakan untuk berbagai kebutuhan aplikasi.

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal hal-hal berikut:

- [Node.js](https://nodejs.org/) versi 14.x atau lebih tinggi
- [MongoDB](https://www.mongodb.com/) atau koneksi ke MongoDB Atlas

## Instalasi

1. Clone repositori ini ke dalam direktori lokal Anda.

    ```bash
    git clone https://github.com/username/UAS_SoftwareDevelopment_Kelompok7.git
    ```

2. Masuk ke dalam direktori proyek.

    ```bash
    cd UAS_SoftwareDevelopment_Kelompok7
    ```

3. Instal dependensi yang diperlukan menggunakan npm.

    ```bash
    npm install
    ```

## Konfigurasi

1. Salin file `.env.example` menjadi file `.env` di direktori root proyek Anda.

    ```bash
    cp .env.example .env
    ```

2. Buka file `.env` dan pastikan konfigurasi berikut sudah sesuai dengan lingkungan Anda:

    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/DigiSteels
    JWT_SECRET=supersecretkey
    ```

    - **PORT**: Port tempat server akan berjalan (default 5000).
    - **MONGO_URI**: URL koneksi ke MongoDB. Jika Anda menggunakan MongoDB lokal, biarkan seperti `mongodb://localhost:27017/DigiSteels`.
    - **JWT_SECRET**: Kunci rahasia untuk membuat dan memverifikasi JSON Web Tokens (JWT).

## Menjalankan Aplikasi

1. Setelah semua dependensi terinstal dan konfigurasi selesai, jalankan aplikasi dengan perintah:

    ```bash
    npm start
    ```

2. Aplikasi akan berjalan di `http://localhost:5000` (atau port yang Anda tentukan dalam file `.env`).

3. Anda dapat mengakses aplikasi dan memverifikasi bahwa server berjalan dengan membuka URL `http://localhost:5000` di browser atau menggunakan alat seperti Postman.

## Struktur Direktori


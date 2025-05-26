let currentEditingProduct = null; // Variabel untuk simpan produk yang sedang diedit
let editedImageDataURL = null; // Variabel untuk simpan URL data gambar yang diedit

const popup = document.getElementById('popup_produk');
const close = document.querySelector('.close');

const popupJudul = document.getElementById('judul_produk');
const popupJenis = document.getElementById('jenis_produk');
const popupGambar = document.getElementById('gambar_produk');
const popupThickness = document.getElementById('popup_thickness');
const popupHole = document.getElementById('popup_hole');
const popupSize = document.getElementById('popup_size');
const popupStock = document.getElementById('popup_stock');
const popupPrice = document.getElementById('popup_price');

const detailThickness = document.getElementById('detail_thickness');
const detailHole = document.getElementById('detail_hole');
const detailSize = document.getElementById('detail_size');

const productItems = document.querySelectorAll('.produk');

productItems.forEach(produk => {
    produk.addEventListener('click', () => {
        // Mengambil data atribut dari produk yang diklik
        const title = produk.getAttribute('data-judul');
        const type = produk.getAttribute('data-jenis');
        const image = produk.getAttribute('data-gambar');

        const thickness = produk.getAttribute('data-thickness');
        const hole = produk.getAttribute('data-hole');
        const size = produk.getAttribute('data-size');
        const stock = produk.getAttribute('data-stock');
        const price = produk.getAttribute('data-price');

        // Menampilkan data produk ke dalam popup
        popupJudul.textContent = title;
        popupJenis.textContent = type;
        popupGambar.src = image;

        // Membersihkan tombol-tombol sebelumnya
        popupThickness.innerHTML = '';
        popupHole.innerHTML = '';
        popupSize.innerHTML = '';

        // Memeriksa dan menampilkan ketebalan (thickness) jika ada
        if (thickness && thickness.trim() !== '') {
            detailThickness.style.display = 'block';
            thickness.split(',').forEach(t => {
                const hasilThickness = t.trim();
                const btn = document.createElement('button');
                btn.className = 'thickness_btn';
                btn.textContent = hasilThickness;

                // Menambahkan event listener untuk tombol ketebalan
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.thickness_btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');
                });
                popupThickness.appendChild(btn);
            });
        } else {
            detailThickness.style.display = 'none';
        }

        // Memeriksa dan menampilkan lubang (hole) jika ada
        if (hole && hole.trim() !== '') {
            detailHole.style.display = 'block';
            hole.split(',').forEach(t => {
                const hasilHole = t.trim();
                const btn = document.createElement('button');
                btn.className = 'hole_btn';
                btn.textContent = hasilHole;

                // Menambahkan event listener untuk tombol lubang
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.hole_btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');
                });
                popupHole.appendChild(btn);
            });
        } else {
            detailHole.style.display = 'none';
        }

        // Memeriksa dan menampilkan ukuran (size) jika ada
        if (size && size.trim() !== '') {
            detailSize.style.display = 'block';
            size.split(',').forEach(t => {
                const hasilSize = t.trim();
                const btn = document.createElement('button');
                btn.className = 'size_btn';
                btn.textContent = hasilSize;

                // Menambahkan event listener untuk tombol ukuran
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.size_btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');
                });
                popupSize.appendChild(btn);
            });
        } else {
            detailSize.style.display = 'none';
        }

        // Menampilkan stok dan harga
        popupStock.textContent = stock;
        popupPrice.textContent = price;

        // Menampilkan popup
        popup.style.display = 'block';
    });
});

// untuk menutup popup
close.addEventListener('click', () => {
    popup.style.display = 'none';
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".produk").forEach((produk) => {
        // memperbarui tampilan stok untuk setiap produk
        const stock = parseInt(produk.getAttribute("data-stock"),10);
        const stockProduk = produk.closest('.daftar_produk').querySelector('.nilai_stock');

        stockProduk.textContent = stock;

        // menghapus warning jika lebih daari 10 stok
        const existingWarning = produk.querySelector(".stock-warning");
        if(existingWarning){
            existingWarning.remove();
        }

        // menambahkan warning jika kurang dari 10
        if(stock < 10){
            const warning = document.createElement("div");
            warning.classList.add("stock-warning");
            warning.textContent = "!";
            produk.appendChild(warning);
        }
    });
});


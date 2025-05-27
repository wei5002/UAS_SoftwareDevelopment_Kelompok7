let currentEditingProduct = null;
let editedImageDataURL = null;

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

const tambahBtn = document.querySelector('.tambah_btn');
const kurangBtn = document.querySelector('.kurang_btn');
const jumlahEl = document.getElementById('jumlah_produk');
const keranjangBtn = document.querySelector('.keranjang_btn');

let jumlahProduk = 0;

const productItems = document.querySelectorAll('.produk');

productItems.forEach(produk => {
    produk.addEventListener('click', () => {
        const title = produk.getAttribute('data-judul');
        const type = produk.getAttribute('data-jenis');
        const image = produk.getAttribute('data-gambar');
        const thickness = produk.getAttribute('data-thickness');
        const hole = produk.getAttribute('data-hole');
        const size = produk.getAttribute('data-size');
        const stock = produk.getAttribute('data-stock');
        const price = produk.getAttribute('data-price');

        popupJudul.textContent = title;
        popupJenis.textContent = type;
        popupGambar.src = image;

        popupThickness.innerHTML = '';
        popupHole.innerHTML = '';
        popupSize.innerHTML = '';

        if (thickness && thickness.trim() !== '') {
            detailThickness.style.display = 'block';
            thickness.split(',').forEach(t => {
                const hasilThickness = t.trim();
                const btn = document.createElement('button');
                btn.className = 'thickness_btn';
                btn.textContent = hasilThickness;
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.thickness_btn').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                });
                popupThickness.appendChild(btn);
            });
        } else {
            detailThickness.style.display = 'none';
        }

        if (hole && hole.trim() !== '') {
            detailHole.style.display = 'block';
            hole.split(',').forEach(t => {
                const hasilHole = t.trim();
                const btn = document.createElement('button');
                btn.className = 'hole_btn';
                btn.textContent = hasilHole;
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.hole_btn').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                });
                popupHole.appendChild(btn);
            });
        } else {
            detailHole.style.display = 'none';
        }

        if (size && size.trim() !== '') {
            detailSize.style.display = 'block';
            size.split(',').forEach(t => {
                const hasilSize = t.trim();
                const btn = document.createElement('button');
                btn.className = 'size_btn';
                btn.textContent = hasilSize;
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.size_btn').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                });
                popupSize.appendChild(btn);
            });
        } else {
            detailSize.style.display = 'none';
        }

        popupStock.textContent = stock;
        popupPrice.textContent = price;

        jumlahProduk = 0;
        jumlahEl.textContent = jumlahProduk;
        kurangBtn.disabled = true;

        tambahBtn.onclick = () => {
            if (jumlahProduk < parseInt(stock, 10)) {
                jumlahProduk++;
                jumlahEl.textContent = jumlahProduk;
                kurangBtn.disabled = jumlahProduk === 0;
            } else {
                alert("Jumlah tidak boleh melebihi stok yang tersedia.");
            }
        };

        kurangBtn.onclick = () => {
            if (jumlahProduk > 0) {
                jumlahProduk--;
                jumlahEl.textContent = jumlahProduk;
                kurangBtn.disabled = jumlahProduk === 0;
            }
        };

        keranjangBtn.onclick = () => {
            if (jumlahProduk > 0) {
                if (jumlahProduk <= parseInt(stock, 10)) {
                    alert("Success to cart");
                    popup.style.display = 'none'; // tutup popup
                    jumlahProduk = 0;
                    jumlahEl.textContent = jumlahProduk;
                    kurangBtn.disabled = true;
                } else {
                    alert("Jumlah melebihi stok tersedia.");
                }
            } else {
                alert("Masukkan jumlah produk terlebih dahulu.");
            }
        };

        popup.style.display = 'block';
    });
});

close.addEventListener('click', () => {
    popup.style.display = 'none';
    jumlahProduk = 0;
    jumlahEl.textContent = jumlahProduk;
    kurangBtn.disabled = true;
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".produk").forEach((produk) => {
        const stock = parseInt(produk.getAttribute("data-stock"), 10);
        const stockProduk = produk.closest('.daftar_produk').querySelector('.nilai_stock');
        stockProduk.textContent = stock;

        const existingWarning = produk.querySelector(".stock-warning");
        if (existingWarning) {
            existingWarning.remove();
        }

        if (stock < 10) {
            const warning = document.createElement("div");
            warning.classList.add("stock-warning");
            warning.textContent = "!";
            produk.appendChild(warning);
        }
    });
});

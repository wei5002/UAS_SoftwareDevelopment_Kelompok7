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
const kurangBtn = document.getElementById('jumlah_produk') ? document.querySelector('.kurang_btn') : null;
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

        currentEditingProduct = produk;

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
                btn.addEventListener('click', function () {
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
                btn.addEventListener('click', function () {
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
                btn.addEventListener('click', function () {
                    document.querySelectorAll('.size_btn').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                });
                popupSize.appendChild(btn);
            });

            // === ⬇️ Tambahan: cocokkan dengan .order-card-size jika ada
            const orderCard = produk.closest('.order-card');
            const orderCardSize = orderCard ? orderCard.querySelector('.order-card-size p') : null;
            if (orderCardSize) {
                const orderCardSizeValue = orderCardSize.textContent.trim().toLowerCase();
                const sizeBtns = popupSize.querySelectorAll('.size_btn');
                sizeBtns.forEach(btn => {
                    if (btn.textContent.trim().toLowerCase() === orderCardSizeValue) {
                        btn.classList.add("active");
                    } else {
                        btn.classList.remove("active");
                    }
                });
            }

            const saveChangesBtn = document.getElementById('save_changes');
            saveChangesBtn.onclick = () => {
                if (!currentEditingProduct) return;

                const selectedSizeBtn = document.querySelector('.size_btn.active');
                if (!selectedSizeBtn) {
                    alert('Silakan pilih size terlebih dahulu!');
                    return;
                }

                // Update size di order-card-size
                const orderCard = currentEditingProduct.closest('.order-card');
                const orderCardSizeP = orderCard.querySelector('.order-card-size p');
                if (orderCardSizeP) {
                    orderCardSizeP.textContent = selectedSizeBtn.textContent;
                }

                // Update jumlah produk di .amount-value
                const amountEl = orderCard.querySelector('.amount-value');
                if (amountEl) {
                    amountEl.textContent = jumlahProduk;
                }

                alert('Perubahan tersimpan!');
                popup.style.display = 'none';
            }; 

        } else {
            detailSize.style.display = 'none';
        }

        popupStock.textContent = stock;
        popupPrice.textContent = price;

        const amountEl = produk.closest('.order-card').querySelector('.amount-value');
        const initialAmount = amountEl ? parseInt(amountEl.textContent.trim(), 10) || 0 : 0;
        jumlahProduk = initialAmount;
        jumlahEl.textContent = jumlahProduk;
        kurangBtn.disabled = jumlahProduk === 0;

        // jumlahProduk = 0;
        // jumlahEl.textContent = jumlahProduk;
        // kurangBtn.disabled = true;

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
            const selectedThickness = document.querySelector('.thickness_btn.active');
            const selectedHole = document.querySelector('.hole_btn.active');
            const selectedSize = document.querySelector('.size_btn.active');

            const isNeedThickness = thickness && thickness.trim() !== '';
            const isNeedHole = hole && hole.trim() !== '';
            const isNeedSize = size && size.trim() !== '';

            if ((isNeedThickness && !selectedThickness) ||
                (isNeedHole && !selectedHole) ||
                (isNeedSize && !selectedSize)) {
                alert("Silakan pilih opsi yang tersedia (thickness, hole, atau size) sebelum menambahkan ke keranjang.");
                return;
            }

            if (jumlahProduk > 0 && jumlahProduk <= parseInt(stock, 10)) {
                alert("Success to cart");
                popup.style.display = 'none';
                jumlahProduk = 0;
                jumlahEl.textContent = jumlahProduk;
                kurangBtn.disabled = true;
            } else if (jumlahProduk === 0) {
                alert("Masukkan jumlah produk terlebih dahulu.");
            } else {
                alert("Jumlah melebihi stok tersedia.");
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


document.addEventListener('click', function (e) {
    if (e.target.closest('.delete-cart-btn')) {
        const orderCard = e.target.closest('.order-card');
        if (orderCard) {
            orderCard.remove();

            const remainingCards = document.querySelectorAll('.order-card');
            if (remainingCards.length === 0) {
                document.getElementById('emptyCartMessage').style.display = 'block';
            }
        }
    }
});
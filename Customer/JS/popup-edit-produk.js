const editPopup = document.getElementById('edit-popup');
const editCloseBtn = editPopup.querySelector('.close');
const editForm = document.getElementById('edit-form');

// fungsi menampilkan popup edit 
function showEditPopup(product) {
    currentEditingProduct = product; // menyimpan produk yang sedang diedit
    document.getElementById('edit-title').value = product.getAttribute('data-judul');
    document.getElementById('edit-thickness').value = product.getAttribute('data-thickness') || '';
    document.getElementById('edit-hole').value = product.getAttribute('data-hole') || '';
    document.getElementById('edit-size').value = product.getAttribute('data-size') || '';
    document.getElementById('edit-stock').value = product.getAttribute('data-stock');
    document.getElementById('edit-price').value = product.getAttribute('data-price');

    // menampilkan gambar produk
    const imageSrc = product.getAttribute('data-gambar');
    const editImage = document.getElementById('edit_gambar');
    editImage.src = imageSrc;
    editImage.style.display = 'block';

    // menampilkan popup edit
    editPopup.style.display = 'block';
}

// tombol edit dalam popup produk
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit_btn')) {
        const productPopup = document.getElementById('popup_produk');
        const productTitle = productPopup.querySelector('#judul_produk').textContent;

        // mencari produk yang sesuai dengan judul
        const products = document.querySelectorAll('.produk');
        let currentProduct = null;

        products.forEach(product => {
            if (product.getAttribute('data-judul') === productTitle) {
                currentProduct = product;
            }
        });

        if (currentProduct) {
            showEditPopup(currentProduct);
        }
    }
});

// menutup popup edit
editCloseBtn.addEventListener('click', () => {
    editPopup.style.display = 'none';
    currentEditingProduct = null;
});

// menutup popup edit ketika mengklik di luar area popup
window.addEventListener('click', (event) => {
    if (event.target === editPopup) {
        editPopup.style.display = 'none';
        currentEditingProduct = null;
    }
});

// menangani submit form edit
editForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!currentEditingProduct) {
        alert('No Products Selected For Editing.');
        return;
    }

    // mengambil nilai dari form edit
    const title = document.getElementById('edit-title').value;
    const thickness = document.getElementById('edit-thickness').value;
    const hole = document.getElementById('edit-hole').value;
    const size = document.getElementById('edit-size').value;
    const stock = document.getElementById('edit-stock').value;
    const price = document.getElementById('edit-price').value;

    // memperbarui atribut produk dengan nilai baru
    currentEditingProduct.setAttribute('data-judul', title);
    currentEditingProduct.setAttribute('data-thickness', thickness);
    currentEditingProduct.setAttribute('data-hole', hole);
    currentEditingProduct.setAttribute('data-size', size);
    currentEditingProduct.setAttribute('data-stock', stock);
    currentEditingProduct.setAttribute('data-price', price);

    // memperbarui judul produk dalam daftar
    const daftarProduk = currentEditingProduct.closest('.daftar_produk');
    if (daftarProduk) {
        const titleElement = daftarProduk.querySelector('h3');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    // memperbarui tampilan stok
    const stockSpan = currentEditingProduct.closest('.daftar_produk').querySelector('.nilai_stock');
    stockSpan.textContent = stock;

    // memperbarui peringatan stok
    const warning = currentEditingProduct.querySelector('.stock-warning');
    if (parseInt(stock) < 10) {
        if (!warning) {
            const newWarning = document.createElement("div");
            newWarning.classList.add("stock-warning");
            newWarning.textContent = "!";
            currentEditingProduct.appendChild(newWarning);
        }
    } else if (warning) {
        warning.remove();
    }

    // memperbarui gambar jika ada gambar baru yang diupload
    if (editedImageDataURL) {
        currentEditingProduct.setAttribute('data-gambar', editedImageDataURL);
        const productImg = currentEditingProduct.querySelector('img');
        if (productImg) {
            productImg.src = editedImageDataURL; // memperbarui gambar produk dalam daftar
        }
        // memperbarui gambar dalam popup detail jika terbuka
        if (popup.style.display === 'block') {
            popupGambar.src = editedImageDataURL; // memperbarui gambar dalam popup detail
        }
    }

    // menutup popup edit dan detail
    editPopup.style.display = 'none';
    popup.style.display = 'none';

    alert('Produk berhasil diperbarui!');
});

// fungsi untuk upload gambar
const editImage = document.getElementById('edit_gambar');
const editImageInput = document.getElementById('edit-image');

// event listener untuk mengklik gambar dalam popup edit
editImage.addEventListener('click', () => {
    editImageInput.click();
});

// event listener untuk perubahan input gambar
editImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            editedImageDataURL = e.target.result; // Menyimpan URL data gambar
            editImage.src = editedImageDataURL; // Menampilkan gambar
        };
        reader.readAsDataURL(file);
    }
});


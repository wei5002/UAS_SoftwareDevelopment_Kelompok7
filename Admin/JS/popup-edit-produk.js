const editPopup = document.getElementById('edit-popup');
const editCloseBtn = editPopup.querySelector('.close');
const editForm = document.getElementById('edit-form');

// fungsi menampilkan popup edit 
function showEditPopup(product) {
    currentEditingProduct = product;
    document.getElementById('edit-title').value = product.getAttribute('data-judul');
    document.getElementById('edit-thickness').value = product.getAttribute('data-thickness') || '';
    document.getElementById('edit-hole').value = product.getAttribute('data-hole') || '';
    document.getElementById('edit-size').value = product.getAttribute('data-size') || '';

    const imageSrc = product.getAttribute('data-gambar');
    const editImage = document.getElementById('edit_gambar');
    editImage.src = imageSrc;
    editImage.style.display = 'block';

    editPopup.style.display = 'block';
}

// tombol edit dalam popup produk
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit_btn')) {
        const productPopup = document.getElementById('popup_produk');
        const productTitle = productPopup.querySelector('#judul_produk').textContent;

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

editCloseBtn.addEventListener('click', () => {
    editPopup.style.display = 'none';
    currentEditingProduct = null;
});

window.addEventListener('click', (event) => {
    if (event.target === editPopup) {
        editPopup.style.display = 'none';
        currentEditingProduct = null;
    }
});

// ✅ SUBMIT: Kirim update ke backend
editForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!currentEditingProduct) {
        alert('No Products Selected For Editing.');
        return;
    }

    const id = currentEditingProduct.getAttribute("data-id");
    const title = document.getElementById('edit-title').value;
    const thickness = document.getElementById('edit-thickness').value;
    const hole = document.getElementById('edit-hole').value;
    const size = document.getElementById('edit-size').value;

    const data = {
        namaProduk: title,
        thickness,
        hole,
        size,
    };

    if (editedImageDataURL) {
        data.gambarProduk = editedImageDataURL;
    }

    try {
        await fetch(`/api/produk/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        popup.style.display = 'none';
        editPopup.style.display = 'none';

        if (typeof loadProducts === 'function') {
            loadProducts(); // reload tampilan
        }

        alert('Produk berhasil diperbarui!');
    } catch (error) {
        console.error('Gagal mengedit produk:', error);
        alert('Gagal mengedit produk. Coba lagi.');
    }
    const deleteButton = document.querySelector('.delete_btn');

    deleteButton.addEventListener('click', async () => {
        if (!currentEditingProduct) {
            alert('Tidak ada produk yang dipilih.');
            return;
    }

        const id = currentEditingProduct.getAttribute('data-id');

        const konfirmasi = confirm('Apakah Anda yakin ingin menghapus produk ini?');
        if (!konfirmasi) return;

         try {
            await fetch(`/api/produk/${id}`, {
            method: 'DELETE'
        });

            alert('Produk berhasil dihapus.');

            // tutup popup
            editPopup.style.display = 'none';
            popup.style.display = 'none';

        if (typeof loadProducts === 'function') {
      loadProducts(); // refresh produk
        }
        } catch (error) {
        console.error('Gagal menghapus produk:', error);
        alert('Terjadi kesalahan saat menghapus produk.');
        }
    });

});

// Gambar edit
const editImage = document.getElementById('edit_gambar');
const editImageInput = document.getElementById('edit-image');

editImage.addEventListener('click', () => {
    editImageInput.click();
});

editImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            editedImageDataURL = e.target.result;
            editImage.src = editedImageDataURL;
        };
        reader.readAsDataURL(file);
    }
});

// tombol tambah produk
document.querySelector('.add_product').addEventListener('click', function () {
  document.getElementById('add-product-popup').style.display = 'block';
});

// penutupan popup
document.querySelector('#add-product-popup .close').addEventListener('click', function () {
  document.getElementById('add-product-popup').style.display = 'none';
});

// preview gambar saat dipilih
document.getElementById('new-product-image').addEventListener('change', function (e) {
  const preview = document.getElementById('new-product-preview');
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    preview.src = e.target.result;
    preview.style.display = 'block';
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

// tangani form tambah produk dan kirim ke backend MongoDB Atlas
document.getElementById('add-product-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('new-product-title').value;
  const imageInput = document.getElementById('new-product-image');
  const thickness = document.getElementById('new-product-thickness').value;
  const hole = document.getElementById('new-product-hole').value;
  const size = document.getElementById('new-product-size').value;
  const stock = document.getElementById('new-product-stock').value;
  const price = document.getElementById('new-product-price').value;

  // validasi form
  if (!title || !size || !stock || !price || !imageInput.files[0]) {
    alert('Please fill all the required fields!');
    return;
  }

  const reader = new FileReader();

  reader.onloadend = async function () {
    const gambarBase64 = reader.result;

    try {
      // kirim data ke backend
      await fetch('/api/produk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: title,
          gambar: gambarBase64,
          thickness,
          hole,
          size,
          stok: parseInt(stock),
          harga: parseInt(price.replace(/\D/g, '')) // hilangkan "Rp" dan titik
        })
      });

      // reset dan tutup popup
      document.getElementById('add-product-form').reset();
      document.getElementById('new-product-preview').style.display = 'none';
      document.getElementById('add-product-popup').style.display = 'none';

      // refresh data produk
      if (typeof loadProducts === 'function') {
        loadProducts();
      }

      alert('Produk berhasil ditambahkan!');
    } catch (error) {
      console.error('Gagal menambahkan produk:', error);
      alert('Gagal menambahkan produk. Coba lagi.');
    }
  };

  reader.readAsDataURL(imageInput.files[0]);
});

// menambahkan event listener ke produk
function addProductClickHandler(productElement) {
  productElement.addEventListener('click', function () {
    // Kosong karena handler detail sudah diatur di product.js
  });
}

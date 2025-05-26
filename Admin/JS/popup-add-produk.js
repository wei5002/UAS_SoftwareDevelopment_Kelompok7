// tombol tambah produk
document.querySelector('.add_product').addEventListener('click', function() {
  document.getElementById('add-product-popup').style.display = 'block';
});

//  penutupan popup
document.querySelector('#add-product-popup .close').addEventListener('click', function() {
  document.getElementById('add-product-popup').style.display = 'none';
});

// preview gambar saat dipilih
document.getElementById('new-product-image').addEventListener('change', function(e) {
  const preview = document.getElementById('new-product-preview');
  const file = e.target.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    preview.src = e.target.result;
    preview.style.display = 'block';
  }
  
  if (file) {
    reader.readAsDataURL(file);
  }
});

// tangani form tambah produk
document.getElementById('add-product-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // ambil nilai dari form
  const title = document.getElementById('new-product-title').value;
  const imageInput = document.getElementById('new-product-image');
  const thickness = document.getElementById('new-product-thickness').value;
  const hole = document.getElementById('new-product-hole').value;
  const size = document.getElementById('new-product-size').value;
  const stock = document.getElementById('new-product-stock').value;
  const price = document.getElementById('new-product-price').value;
  
  // validasi
  if (!title || !size || !stock || !price || !imageInput.files[0]) {
    alert('Please Fill All The Required Field!');
    return;
  }
  
  // Buat elemen produk baru
  const newProduct = document.createElement('div');
  newProduct.className = 'daftar_produk';
  newProduct.innerHTML = `
    <div class="produk"
          data-judul="${title}"
          data-gambar="${URL.createObjectURL(imageInput.files[0])}"
          data-thickness="${thickness}"
          data-hole="${hole}"
          data-size="${size}"
          data-stock="${stock}"
          data-price="${price}">
      <img src="${URL.createObjectURL(imageInput.files[0])}" alt="${title}">
    </div>
    <h3>${title}</h3>
    <p class="stock_produk">Stock: <span class="nilai_stock">${stock}</span></p>
    <p>Click for more</p>
  `;
  
  // tambahkan produk ke grid
  document.querySelector('.grid_produk').appendChild(newProduct);

  
  // reset form dan tutup popup
  this.reset();
  document.getElementById('new-product-preview').style.display = 'none';
  document.getElementById('add-product-popup').style.display = 'none';
  
  // tambahkan event listener untuk produk baru
  addProductClickHandler(newProduct.querySelector('.produk'));
  
  alert('Add Product Success!');
});

// menambahkan event listener ke produk
function addProductClickHandler(productElement) {
  productElement.addEventListener('click', function() {
  });
}

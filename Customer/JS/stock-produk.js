document.addEventListener("DOMContentLoaded",function(){
    const daftarProduk = document.querySelectorAll(".daftar_produk");

    daftarProduk.forEach(item =>{
        const produk = item.querySelector(".produk");
        const stock = produk.getAttribute('data-stock');

        const nilaiStock = item.querySelector(".nilai_stock");
        if(nilaiStock){
            nilaiStock.textContent = stock;
        }
    });
});
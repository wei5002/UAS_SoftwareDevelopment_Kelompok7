'use client';

import { useEffect, useState } from 'react';
import CustomerNavbar from '@/app/components/customNavbar';
import Footer from '@/app/footer';
import Image from 'next/image';

type Produk = {
  id: string;
  namaProduk: string;
  kategori: string;
  harga: number;
  stok: number;
  gambar: string;
};

export default function ProdukPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [kategori, setKategori] = useState<'201' | '304' | '316'>('201');

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/produk?kategori=${kategori}`);
        const data = await res.json();
        setProdukList(data.data || []);
      } catch (error) {
        console.error('Gagal memuat produk:', error);
      }
    };

    fetchProduk();
  }, [kategori]);

  return (
    <>
      <CustomerNavbar />

      {/* Hero */}
      <section className="hero">
        <Image
          src="/assets/images/hero.jpg"
          alt="hero"
          className="hero-bg"
          width={1920}
          height={300}
        />
        <div className="hero-text">
          <h1>DISCOVER OUR HIGH - QUALITY <br /> PRODUCTS</h1>
        </div>
      </section>

   <div className="tab_container">
  <div className="tab">
    {['201', '304', '316'].map((kode) => (
      <a
        key={kode}
        className={kategori === kode ? 'active' : ''}
        onClick={(e) => {
          e.preventDefault();
          setKategori(kode as '201' | '304' | '316');
        }}
        href="#"
      >
        {kode}
      </a>
    ))}
  </div>
</div>

      {/* Grid Produk */}
      <div className="grid_produk">
        {produkList.length === 0 ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Tidak ada produk ditemukan.</p>
        ) : (
          produkList.map((produk) => (
            <div className="daftar_produk" key={produk.id}>
              <div className="produk">
                <img src={produk.gambar} alt={produk.namaProduk} />
                {produk.stok <= 10 && <div className="stock-warning">!</div>}
              </div>
              <h3>{produk.namaProduk}</h3>
              <p>Stok: {produk.stok}</p>
              <p style={{ fontSize: '0.9rem', color: '#555' }}>Click for more</p>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
}

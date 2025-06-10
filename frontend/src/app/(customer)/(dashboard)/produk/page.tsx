'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './produk.module.css';
import Header from '@/app/header';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/footer';
import ProductModal from './components/ProductModal';

export default function ProdukPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kategoriParam = searchParams.get('kategori');
  const modalId = searchParams.get('modalId');

  const [produk, setProduk] = useState([]);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/produk');
        const json = await response.json();
        setProduk(json.data || []);
      } catch (error) {
        console.error('Gagal fetch produk:', error);
      }
    };

    fetchProduk();
  }, []);

  const produkFiltered = produk.filter((item: any) =>
    kategoriParam ? item.kategori === kategoriParam : item.kategori === '201'
  );

  return (
    <>
      <Header />
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <img src="/assets/images/hero.jpg" alt="hero" className={styles.heroBg} />
          <div className={styles.heroText}>
            <h1>DISCOVER OUR HIGH - QUALITY <br /> PRODUCTS</h1>
          </div>
        </section>

        {/* Tabs */}
        <div className={styles.tabContainer}>
          <nav className={styles.tab}>
            <a
              href="/produk?kategori=201"
              className={kategoriParam === '201' || !kategoriParam ? styles.activeTab : ''}
            >
              201
            </a>
            <a
              href="/produk?kategori=304"
              className={kategoriParam === '304' ? styles.activeTab : ''}
            >
              304
            </a>
            <a
              href="/produk?kategori=316"
              className={kategoriParam === '316' ? styles.activeTab : ''}
            >
              316
            </a>
          </nav>
        </div>

        {/* Grid Produk */}
        <div className={styles.gridProduk}>
          {produkFiltered.map((item: any) => (
            <div key={item.id} className={styles.daftarProduk}>
              <div
                className={styles.produk}
                onClick={() => router.push(`/produk?modalId=${item.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <img src={item.gambar} alt={item.namaProduk} />
              </div>
              <h3>{item.namaProduk}</h3>
              {/* Stock DIHAPUS */}
              <p
                style={{
                  color: '#4a89dc',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
                onClick={() => router.push(`/produk?modalId=${item.id}`)}
              >
                Click for more
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Client-side modal tampil di atas */}
      {modalId && (
        <ProductModal
          id={modalId}
          onClose={() => router.push('/produk')}
        />
      )}

      <Footer />
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './produk.module.css';
import Header from '@/app/header';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/footer';
import ProductModal from './components/ProductModal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function ProdukClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kategoriParam = searchParams.get('kategori');
  const modalId = searchParams.get('modalId');

  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (kategoriParam) params.append('kategori', kategoriParam);
        params.append('status', 'AKTIF');
        const url = `${API_BASE_URL}/produk?${params.toString()}`;
        const response = await fetch(url);
        const json = await response.json();
        setProduk(json.data || []);
      } catch (error) {
        console.error('Gagal fetch produk:', error);
        setProduk([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProduk();
  }, [kategoriParam]);

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
          {loading ? (
            <p style={{ textAlign: 'center', padding: 60 }}>Loading...</p>
          ) : produk.length === 0 ? (
            <p style={{ textAlign: 'center', padding: 60, color: '#999' }}>
              Produk belum tersedia.
            </p>
          ) : (
            produk.map((item: any) => (
              <div key={item.id} className={styles.daftarProduk}>
                <div
                  className={styles.produk}
                  onClick={() => router.push(`/produk?kategori=${item.kategori}&modalId=${item.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={item.gambar || '/Admin/img/default-placeholder.png'}
                    alt={item.namaProduk}
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src = '/Admin/img/default-placeholder.png';
                    }}
                  />
                </div>
                <h3>{item.namaProduk}</h3>
                <p
                  style={{
                    color: '#4a89dc',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                  onClick={() => router.push(`/produk?kategori=${item.kategori}&modalId=${item.id}`)}
                >
                  Click for more
                </p>
              </div>
            ))
          )}
        </div>
      </main>
      {/* Client-side modal tampil di atas */}
      {modalId && (
        <ProductModal
          id={modalId}
          onClose={() => {
            kategoriParam
              ? router.push(`/produk?kategori=${kategoriParam}`)
              : router.push('/produk');
          }}
        />
      )}
      <Footer />
    </>
  );
}

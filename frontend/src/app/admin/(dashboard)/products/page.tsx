'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './products.module.css';
import HeaderAdmin from '@/app/headerAdmin';
import NavbarAdmin from '@/app/components/navbarAdmin';
import Footer from '@/app/footer';
import ProductModal from './components/ProductModal'; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface Varian {
  id: string;
  size?: string;
  thickness?: number;
  hole?: number;
  harga: number;
  stok: number;
}

interface Produk {
  id: string;
  namaProduk: string;
  kategori: string;
  gambar?: string;
  status?: string;
  varian: Varian[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Produk[]>([]);
  const [activeTab, setActiveTab] = useState('201'); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Produk | null>(null);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);

  // Fungsi untuk mengambil semua data produk dari API
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token_admin');
      const response = await fetch(`${API_BASE_URL}/produk`, {
        headers: {
          'Authorization': token || ''
        }
      });
      if (!response.ok) {
        throw new Error('Gagal mengambil data produk');
      }
      const data = await response.json();
      setProducts(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const handleSubmitProduct = async (productData: any, productId?: string) => {
    const token = localStorage.getItem('token_admin');
    try {
      let response;
      if (productId) {
        response = await fetch(`${API_BASE_URL}/produk/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token || ''
          },
          body: JSON.stringify(productData)
        });
      } else {
        response = await fetch(`${API_BASE_URL}/produk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token || ''
          },
          body: JSON.stringify(productData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || 'Gagal menyimpan atau menambahkan produk');
      }
      
      setIsModalOpen(false);
      setIsAddingNewProduct(false);
      fetchProducts();
      alert(`Produk berhasil ${productId ? 'diperbarui' : 'ditambahkan'}!`);

    } catch (err: any) {
      alert(`Error: ${err.message}`);
      throw err;
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const token = localStorage.getItem('token_admin');
    try {
      const response = await fetch(`${API_BASE_URL}/produk/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': token || '' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus produk');
      }
      setIsModalOpen(false);
      fetchProducts();
      alert('Produk berhasil dihapus!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleProductClick = (product: Produk) => {
    setSelectedProduct(product);
    setIsAddingNewProduct(false);
    setIsModalOpen(true);
  };

  const handleOpenAddProductModal = () => {
    setSelectedProduct(null);
    setIsAddingNewProduct(true);
    setIsModalOpen(true);
  };

  const calculateTotalStock = (variants: Varian[]) => {
    return variants.reduce((total, variant) => total + variant.stok, 0);
  };

  const filteredProducts = products.filter(p => p.kategori === activeTab);

  return (
    <>
      <HeaderAdmin />
      <NavbarAdmin />
      <main>
        <section className={styles.hero}>
          <Image src="/assets/images/hero.jpg" alt="Hero background" layout="fill" objectFit="cover" className={styles.heroBg} priority />
          <div className={styles.heroText}><h1>DISCOVER OUR HIGH-QUALITY <br /> PRODUCTS</h1></div>
        </section>

        <div className={styles.tabContainer}>
          <nav className={styles.tab}>
            <button onClick={() => setActiveTab('201')} className={activeTab === '201' ? styles.active : ''}>201</button>
            <button onClick={() => setActiveTab('304')} className={activeTab === '304' ? styles.active : ''}>304</button>
            <button onClick={() => setActiveTab('316')} className={activeTab === '316' ? styles.active : ''}>316</button>
          </nav>
        </div>
        
        {isLoading && <p style={{textAlign: 'center', padding: '50px'}}>Memuat...</p>}
        {error && <p style={{textAlign: 'center', padding: '50px', color: 'red'}}>Error: {error}</p>}
        {!isLoading && !error && (
          <div className={styles.gridProduk}>
            {filteredProducts.map((product) => {
              const totalStock = calculateTotalStock(product.varian);
              return (
                <div 
                  key={product.id} 
                  className={`${styles.daftarProduk} ${product.status === 'NONAKTIF' ? styles.nonAktifProduct : ''}`} 
                  onClick={() => handleProductClick(product)}
                >
                  <div className={styles.produk}>
                    <Image
                      src={product.gambar || '/Admin/img/default-placeholder.png'}
                      alt={product.namaProduk}
                      width={220}
                      height={220}
                      objectFit="cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/Admin/img/default-placeholder.png'; }}
                    />
                    {totalStock < 10 && totalStock > 0 && <div className={styles.stockWarning}>!</div>}
                    <div style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: product.status === 'NONAKTIF' ? '#e57373' : '#43a047',
                      color: 'white',
                      borderRadius: 8,
                      padding: '2px 10px',
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}>
                      {product.status === 'NONAKTIF' ? 'NONAKTIF' : 'AKTIF'}
                    </div>
                  </div>
                  <h3>{product.namaProduk}</h3>
                  <p>Klik untuk detail</p>
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.addProductContainer}>
          <button className={styles.addProduct} onClick={handleOpenAddProductModal}>+</button>
        </div>
      </main>

      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          isNew={isAddingNewProduct}
          onClose={() => setIsModalOpen(false)}
          onSubmitProduct={handleSubmitProduct}
          onDelete={handleDeleteProduct}
          defaultKategori={activeTab}
        />
      )}

      <Footer />
    </>
  );
}

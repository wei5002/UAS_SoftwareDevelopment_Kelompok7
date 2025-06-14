// EditModal dengan URL sudah pakai environment variable

'use client';

import { useEffect, useState } from 'react';
import styles from './editModal.module.css';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function ProductModal({ id, cartItemId, onClose }: { id: string; cartItemId?: string; onClose: () => void }) {
  const router = useRouter();
  const [produk, setProduk] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedThickness, setSelectedThickness] = useState<any>(null);
  const [selectedHole, setSelectedHole] = useState<any>(null);
  const [jumlah, setJumlah] = useState(1);
  
  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    if (!token) {
      setShowLoginAlert(true);
      setTimeout(() => {
        router.replace('/auth/login');
      }, 1500);
      return;
    }
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Detail produk
        const productRes = await fetch(`${API_BASE_URL}/produk/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (productRes.ok) {
          const productData = await productRes.json();
          setProduk(productData.data);
        } else {
          console.error('Gagal mengambil detail produk');
          setLoading(false);
          return;
        }
        // Jika edit mode (cartItemId tersedia)
        if (cartItemId) {
          const cartItemRes = await fetch(`${API_BASE_URL}/keranjang/item/${cartItemId}`, {
             headers: { Authorization: `Bearer ${token}` },
          });
          if(cartItemRes.ok) {
            const cartItemData = await cartItemRes.json();
            const item = cartItemData.data;
            setSelectedSize(item.produkVarian.size);
            setSelectedThickness(item.produkVarian.thickness);
            setSelectedHole(item.produkVarian.hole);
            setJumlah(item.jumlah);
          } else {
             console.error('Gagal mengambil data item keranjang');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id, cartItemId, router]);

  const thicknessSet = Array.from(new Set(produk?.varian.map((v: any) => v.thickness).filter((v: any) => v != null)) || []);
  const holeSet = Array.from(new Set(produk?.varian.map((v: any) => v.hole).filter((v: any) => v != null)) || []);
  const sizeSet = Array.from(new Set(produk?.varian.map((v: any) => v.size).filter((v: any) => v != null && v !== '')) || []);

  const selectedVarian = produk?.varian.find((v: any) => {
    const matchSize = sizeSet.length === 0 || v.size === selectedSize;
    const matchThickness = thicknessSet.length === 0 || v.thickness === selectedThickness;
    const matchHole = holeSet.length === 0 || v.hole === selectedHole;
    return matchSize && matchThickness && matchHole;
  });

  useEffect(() => {
    if (selectedVarian) {
      if (jumlah > selectedVarian.stok) {
        setJumlah(1);
      }
      if (selectedVarian.stok === 0) {
        setJumlah(0);
      }
    }
  }, [selectedVarian, jumlah]);

  const isVariantSelected = selectedVarian !== undefined;
  const hargaTotal = selectedVarian ? selectedVarian.harga * jumlah : 0;
  
  const handleSaveToCart = async () => {
    if (!isVariantSelected) {
      alert('Pilih varian produk yang valid terlebih dahulu.');
      return;
    }
    if (selectedVarian.stok < jumlah || jumlah === 0) {
      alert('Stok tidak mencukupi atau jumlah tidak valid.');
      return;
    }
    const token = localStorage.getItem('customer_token');
    if (!token) {
      alert('Anda harus login terlebih dahulu.');
      router.replace('/auth/login');
      return;
    }
    const isEditing = cartItemId !== undefined;
    const apiUrl = isEditing
      ? `${API_BASE_URL}/keranjang/${cartItemId}/spesifikasi`
      : `${API_BASE_URL}/keranjang`;
    const method = isEditing ? 'PATCH' : 'POST';
    const body = isEditing
      ? {
          size: selectedSize,
          thickness: selectedThickness,
          hole: selectedHole,
          jumlah: jumlah
        }
      : {
          produkVarianId: selectedVarian.id,
          jumlah: jumlah
        };
    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        alert(isEditing ? 'Item keranjang berhasil diperbarui!' : 'Produk berhasil ditambahkan ke keranjang!');
        onClose();
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert(isEditing ? 'Gagal memperbarui item keranjang.' : 'Gagal menambahkan produk.');
      }
    } catch (err) {
      console.error('Network/Client Error:', err);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  if (showLoginAlert) {
    return (
      <div className={styles.popup_produk} style={{ display: 'block' }}>
        <div className={styles.popup_isi}>
          <h2 style={{ color: 'white', textAlign: 'center' }}>
            Anda harus login terlebih dahulu. Mengarahkan ke halaman login...
          </h2>
        </div>
      </div>
    );
  }
  if (loading) {
     return (
       <div className={styles.popup_produk} style={{ display: 'block' }}>
        <div className={styles.popup_isi}>
            <p style={{color: 'white', textAlign: 'center'}}>Memuat data...</p>
        </div>
       </div>
    );
  }
  if (!produk) return null;

  return (
    <div id="popup_produk" className={styles.popup_produk} style={{ display: 'block' }} onClick={onClose}>
      <div className={styles.popup_isi} onClick={(e) => e.stopPropagation()}>
        <span className={styles.close} onClick={onClose}>&times;</span>
        <div className={styles.popup_container}>
          <div className={styles.popup_header}>
            <h2 id="judul_produk" className={styles.judul_produk}>{produk.namaProduk}</h2>
            <br />
            <h2 id="jenis_produk" className={styles.jenis_produk}>{produk.kategori}</h2>
            <img id="gambar_produk" src={produk.gambar} alt={produk.namaProduk} className={styles.gambar_produk}/>
            <div className={styles['kurang-tambah-btn']}>
              <div className={styles.jumlah_wrapper}>
                <button
                  className={styles.kurang_btn}
                  onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                  disabled={!isVariantSelected || selectedVarian?.stok === 0 || jumlah <= 1}
                >
                  -
                </button>
                <span id="jumlah_produk" className={styles.jumlah_produk}>
                    {isVariantSelected && selectedVarian.stok === 0 ? 0 : jumlah}
                </span>
                <button
                  className={styles.tambah_btn}
                  onClick={() => setJumlah(jumlah + 1)}
                  disabled={!isVariantSelected || (selectedVarian && jumlah >= selectedVarian.stok)}
                >
                  +
                </button>
              </div>
              <button
                className={styles.keranjang_btn}
                onClick={handleSaveToCart}
                disabled={!isVariantSelected || (selectedVarian && selectedVarian.stok === 0)}
              >
                {cartItemId ? 'Update Keranjang' : 'Add to Cart'}
              </button>
            </div>
          </div>
          <div className={styles.popup_detail}>
             {thicknessSet.length > 0 && (
              <div className={styles.bagian_kanan} id="detail_thickness">
                <h3 id="judul_thickness">THICKNESS (mm)</h3>
                <div id="popup_thickness" className={styles.thickness_buttons}>
                  {thicknessSet.map((t: any) => (
                    <button
                      key={t}
                      className={`${styles.thickness_btn} ${selectedThickness === t ? styles.active : ''}`}
                      onClick={() => setSelectedThickness(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {holeSet.length > 0 && (
              <div className={styles.bagian_kanan} id="detail_hole">
                <h3 id="judul_hole">HOLE DIAMETER (mm)</h3>
                <div id="popup_hole" className={styles.hole_buttons}>
                  {holeSet.map((h: any) => (
                    <button
                      key={h}
                      className={`${styles.hole_btn} ${selectedHole === h ? styles.active : ''}`}
                      onClick={() => setSelectedHole(h)}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {sizeSet.length > 0 && (
              <div className={styles.bagian_kanan} id="detail_size">
                <h3 id="judul_size">SIZE (mm)</h3>
                <div id="popup_size" className={styles.size_buttons}>
                  {sizeSet.map((s: any) => (
                    <button
                      key={s}
                      className={`${styles.size_btn} ${selectedSize === s ? styles.active : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.popup_action}>
              <div className={styles.stock_price}>
                <p>
                  Stok:{' '}
                  <span id="popup_stock" className={styles.nilai_stock}>
                    {isVariantSelected ? (selectedVarian.stok === 0 ? 'Habis' : selectedVarian.stok) : '-'}
                  </span>
                </p>
                <p>
                  Harga:{' '}
                  <span id="popup_price" className={styles.nilai_price}>
                    Rp {isVariantSelected ? selectedVarian.harga.toLocaleString('id-ID') : '-'}
                  </span>
                </p>
                <p>
                  Total:{' '}
                  <span className={styles.nilai_price}>
                    Rp {hargaTotal.toLocaleString('id-ID')}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

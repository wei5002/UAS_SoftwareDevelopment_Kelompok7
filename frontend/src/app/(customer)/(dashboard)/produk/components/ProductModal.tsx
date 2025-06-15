'use client';

import { useEffect, useState } from 'react';
import styles from '../popupProduk.module.css';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function ProductModal({ id, onClose }: { id: string; onClose: () => void }) {
  const router = useRouter();

  const [produk, setProduk] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');

  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedThickness, setSelectedThickness] = useState<any>(null);
  const [selectedHole, setSelectedHole] = useState<any>(null);
  const [jumlah, setJumlah] = useState(1);

  const showPopup = (message: string, type: 'success' | 'error') => {
    setPopupMessage(message);
    setPopupType(type);
    setTimeout(() => setPopupMessage(''), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    if (!token) {
      setShowLoginAlert(true);
      setTimeout(() => router.replace('/auth/login'), 1500);
      return;
    }
    const fetchProdukDetail = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/produk/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProduk(data.data);
        } else {
          console.error('Gagal ambil produk');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProdukDetail();
  }, [id, router]);

  const thicknessSet = Array.from(new Set(produk?.varian.map((v: any) => v.thickness).filter(Boolean)) || []);
  const holeSet = Array.from(new Set(produk?.varian.map((v: any) => v.hole).filter(Boolean)) || []);
  const sizeSet = Array.from(new Set(produk?.varian.map((v: any) => v.size).filter((s: any) => s !== '')) || []);

  const selectedVarian = produk?.varian.find((v: any) =>
    (sizeSet.length === 0 || (selectedSize && v.size === selectedSize)) &&
    (thicknessSet.length === 0 || (selectedThickness && v.thickness === selectedThickness)) &&
    (holeSet.length === 0 || (selectedHole && v.hole === selectedHole))
  );

  useEffect(() => {
    if (selectedVarian) {
      if (jumlah > selectedVarian.stok) setJumlah(1);
      if (selectedVarian.stok === 0) setJumlah(0);
    }
  }, [selectedVarian, jumlah]);

  const isVariantSelected =
    (sizeSet.length === 0 || selectedSize !== null) &&
    (thicknessSet.length === 0 || selectedThickness !== null) &&
    (holeSet.length === 0 || selectedHole !== null) &&
    selectedVarian !== undefined;

  const hargaTotal = selectedVarian ? selectedVarian.harga * jumlah : 0;

  const handleAddToCart = async () => {
    const token = localStorage.getItem('customer_token');
    if (!token) {
      showPopup('Anda harus login terlebih dahulu.', 'error');
      router.replace('/auth/login');
      return;
    }
    if (!selectedVarian) return showPopup('Pilih varian produk terlebih dahulu.', 'error');
    if (selectedVarian.stok < jumlah || jumlah === 0) {
      return showPopup('Stok tidak mencukupi atau jumlah tidak valid.', 'error');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/keranjang`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          produkVarianId: selectedVarian.id,
          jumlah,
          totalHarga: hargaTotal,
        }),
      });
      if (response.ok) {
        showPopup('Berhasil ditambahkan ke keranjang!', 'success');
        setTimeout(onClose, 2000);
      } else {
        showPopup('Gagal menambahkan ke keranjang.', 'error');
      }
    } catch (err) {
      console.error(err);
      showPopup('Terjadi kesalahan saat menambahkan ke keranjang.', 'error');
    }
  };

  if (showLoginAlert) {
    return (
      <div className={styles.popup_produk} onClick={onClose}>
        <div className={styles.popup_isi} onClick={(e) => e.stopPropagation()}>
          <h2 style={{ textAlign: 'center' }}>Anda harus login terlebih dahulu. Mengarahkan ke login...</h2>
        </div>
      </div>
    );
  }

  if (loading || !produk) return null;

  return (
    <div className={styles.popup_produk} onClick={onClose}>
      <div className={styles.popup_isi} onClick={(e) => e.stopPropagation()}>
        {popupMessage && (
          <div className={`${styles.popup} ${styles[popupType]}`}>
            <p>{popupMessage}</p>
          </div>
        )}

        <span className={styles.close} onClick={onClose}>&times;</span>
        <div className={styles.popup_container}>
          <div className={styles.popup_header}>
            <h2 className={styles.judul_produk}>{produk.namaProduk}</h2>
            <h2 className={styles.jenis_produk}>{produk.kategori}</h2>
            <img src={produk.gambar} alt={produk.namaProduk} className={styles.gambar_produk} />

            <div className={styles['kurang-tambah-btn']}>
              <div className={styles.jumlah_wrapper}>
                <button onClick={() => setJumlah(Math.max(1, jumlah - 1))} disabled={!isVariantSelected || jumlah <= 1} className={styles.kurang_btn}>-</button>
                <span className={styles.jumlah_produk}>{selectedVarian?.stok === 0 ? 0 : jumlah}</span>
                <button onClick={() => setJumlah(jumlah + 1)} disabled={!isVariantSelected || jumlah >= selectedVarian?.stok} className={styles.tambah_btn}>+</button>
              </div>
              <button onClick={handleAddToCart} disabled={!isVariantSelected || selectedVarian?.stok === 0} className={styles.keranjang_btn}>Add to Cart</button>
            </div>
          </div>

          <div className={styles.popup_detail}>
            {thicknessSet.length > 0 && (
              <div className={styles.bagian_kanan}>
                <h3>THICKNESS (mm)</h3>
                <div className={styles.thickness_buttons}>
                  {thicknessSet.map((t: any) => (
                    <button key={t} onClick={() => setSelectedThickness(t)} className={`${styles.thickness_btn} ${selectedThickness === t ? styles.active : ''}`}>{t}</button>
                  ))}
                </div>
              </div>
            )}
            {holeSet.length > 0 && (
              <div className={styles.bagian_kanan}>
                <h3>HOLE DIAMETER (mm)</h3>
                <div className={styles.hole_buttons}>
                  {holeSet.map((h: any) => (
                    <button key={h} onClick={() => setSelectedHole(h)} className={`${styles.hole_btn} ${selectedHole === h ? styles.active : ''}`}>{h}</button>
                  ))}
                </div>
              </div>
            )}
            {sizeSet.length > 0 && (
              <div className={styles.bagian_kanan}>
                <h3>SIZE (mm)</h3>
                <div className={styles.size_buttons}>
                  {sizeSet.map((s: any) => (
                    <button key={s} onClick={() => setSelectedSize(s)} className={`${styles.size_btn} ${selectedSize === s ? styles.active : ''}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.popup_action}>
              <div className={styles.stock_price}>
                <p>Stock: <span className={styles.nilai_stock}>{selectedVarian?.stok === 0 ? 'Habis' : selectedVarian?.stok ?? '-'}</span></p>
                <p>Price: <span className={styles.nilai_price}>Rp {selectedVarian?.harga?.toLocaleString() ?? '-'}</span></p>
                <p>Total: <span className={styles.nilai_price}>Rp {hargaTotal.toLocaleString()}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import styles from '../popupProduk.module.css';
import { useRouter } from 'next/navigation';

export default function ProductModal({ id, onClose }: { id: string; onClose: () => void }) {
  const router = useRouter();

  const [produk, setProduk] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedThickness, setSelectedThickness] = useState<any>(null);
  const [selectedHole, setSelectedHole] = useState<any>(null);
  const [jumlah, setJumlah] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginAlert(true);
      setTimeout(() => {
        router.replace('/auth/login');
      }, 1500);
      return;
    }

    const fetchProdukDetail = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/produk/${id}`, {
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
  }, [id, router]); // Added router to dependency array

  const thicknessSet = Array.from(
    new Set(produk?.varian.map((v: any) => v.thickness).filter((v: any) => v != null)) || []
  );
  const holeSet = Array.from(
    new Set(produk?.varian.map((v: any) => v.hole).filter((v: any) => v != null)) || []
  );
  const sizeSet = Array.from(
    new Set(produk?.varian.map((v: any) => v.size).filter((v: any) => v != null && v !== '')) || []
  );

  const selectedVarian = produk?.varian.find((v: any) => {
    const matchSize = sizeSet.length === 0 || (selectedSize !== null && v.size === selectedSize);
    const matchThickness = thicknessSet.length === 0 || (selectedThickness !== null && v.thickness === selectedThickness);
    const matchHole = holeSet.length === 0 || (selectedHole !== null && v.hole === selectedHole);
    return matchSize && matchThickness && matchHole;
  });

  // MODIFICATION 2: useEffect to handle stock changes when variant changes
  // This ensures the quantity is valid if the user selects a new variant
  // with less stock than the current quantity.
  useEffect(() => {
    if (selectedVarian) {
      // If the current quantity is greater than the new variant's stock, reset to 1
      if (jumlah > selectedVarian.stok) {
        setJumlah(1);
      }
      // If the variant is out of stock, set quantity to 0 (or 1 and disable buttons)
      if (selectedVarian.stok === 0) {
        setJumlah(0);
      }
    }
  }, [selectedVarian, jumlah]);


  const isVariantSelected =
    (sizeSet.length === 0 || selectedSize !== null) &&
    (thicknessSet.length === 0 || selectedThickness !== null) &&
    (holeSet.length === 0 || selectedHole !== null) &&
    selectedVarian !== undefined;

  const hargaTotal = selectedVarian ? selectedVarian.harga * jumlah : 0;

  const handleAddToCart = async () => {
    if (!selectedVarian) {
      alert('Pilih varian produk terlebih dahulu.');
      return;
    }
    
    // Also check if stock is available
    if (selectedVarian.stok < jumlah || jumlah === 0) {
      alert('Stok tidak mencukupi atau jumlah tidak valid.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5001/api/keranjang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          produkVarianId: selectedVarian.id,
          jumlah: jumlah,
          totalHarga: hargaTotal,
        }),
      });

      if (response.ok) {
        alert('Berhasil ditambahkan ke keranjang!');
        onClose();
      } else {
        const errorData = await response.json();
        console.error(errorData);
        alert('Gagal menambahkan ke keranjang.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menambahkan ke keranjang.');
    }
  };

  if (showLoginAlert) {
    return (
      <div id="popup_produk" className={styles.popup_produk} style={{ display: 'block' }} onClick={onClose}>
        <div className={styles.popup_isi} onClick={(e) => e.stopPropagation()}>
          <h2 style={{ color: 'white', textAlign: 'center' }}>
            Anda harus login terlebih dahulu. Mengarahkan ke halaman login...
          </h2>
        </div>
      </div>
    );
  }

  if (loading) return null;
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
            <img id="gambar_produk" src={produk.gambar} alt="" className={styles.gambar_produk}/>
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
                    {/* If stock is 0, show 0, otherwise show the selected amount */}
                    {selectedVarian && selectedVarian.stok === 0 ? 0 : jumlah}
                </span>
                <button
                  className={styles.tambah_btn}
                  onClick={() => setJumlah(jumlah + 1)}
                  // MODIFICATION 1: Disable button if quantity meets or exceeds stock
                  disabled={
                    !isVariantSelected ||
                    (selectedVarian && jumlah >= selectedVarian.stok)
                  }
                >
                  +
                </button>
              </div>
              <button
                className={styles.keranjang_btn}
                onClick={handleAddToCart}
                // Also disable if stock is 0
                disabled={!isVariantSelected || (selectedVarian && selectedVarian.stok === 0)}
              >
                Add to Cart
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
                  Stock:{' '}
                  <span id="popup_stock" className={styles.nilai_stock}>
                     {/* If a variant is out of stock, show a more obvious message */}
                    {selectedVarian?.stok === 0 ? 'Habis' : selectedVarian?.stok ?? '-'}
                  </span>
                </p>
                <p>
                  Price:{' '}
                  <span id="popup_price" className={styles.nilai_price}>
                    Rp {selectedVarian ? selectedVarian.harga.toLocaleString() : '-'}
                  </span>
                </p>
                <p>
                  Total:{' '}
                  <span className={styles.nilai_price}>
                    Rp {hargaTotal.toLocaleString()}
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
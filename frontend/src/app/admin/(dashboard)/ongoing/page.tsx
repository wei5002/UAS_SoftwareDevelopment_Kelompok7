'use client';

import { useState, useEffect } from 'react';
import styles from './ongoing.module.css';
import HeaderAdmin from '@/app/headerAdmin';
import NavbarAdmin from '@/app/components/navbarAdmin';
import FooterHitam from '@/app/components/footerHitam';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Interface definitions
type Produk = {
  id: string;
  namaProduk: string;
  gambar?: string;
};
type ProdukVarian = {
  id: string;
  produk: Produk;
  size?: string;
  thickness?: number;
  hole?: number;
  harga: number;
};
type KeranjangBelanja = {
  id: string;
  produkVarian: ProdukVarian;
  jumlah: number;
  totalHarga: number;
};
type Pelanggan = {
  id: string;
  nama: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  alamatDetail: string;
  nomorTelepon: string;
};
type PembatalanPesanan = {
  alasanPembatalan: string;
  catatanAdmin?: string;
};
type Pesanan = {
  id: string;
  user: Pelanggan;
  keranjang: KeranjangBelanja;
  status: string;
  ongkosKirim: number;
  alamatDetail: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  nomorTelepon: string;
  bankName: string;
  accountName: string;
  accountNumber: number | string;
  buktiTransferUrl: string;
  alasanPenolakan?: string;
  pembatalanPesanan?: PembatalanPesanan;
};

export default function OngoingOrdersPage() {
  const [orders, setOrders] = useState<Pesanan[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Pesanan | null>(null);

  // State untuk popup pembatalan
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [adminCancelReason, setAdminCancelReason] = useState('');
  const [uploadRefund, setUploadRefund] = useState(false);

  // State untuk popup detail
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [orderForDetail, setOrderForDetail] = useState<Pesanan | null>(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token_admin');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/pesanan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal mengambil data pesanan.');
      const data = await res.json();
      setOrders(
        Array.isArray(data.data)
          ? data.data.filter(
              (p: Pesanan) => ['ON_PROCESS', 'ON_DELIVERY', 'DONE'].includes(p.status)
            )
          : []
      );
    } catch (error) {
      console.error('Fetch error:', error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem('token_admin');
    try {
      const res = await fetch(`${API_BASE_URL}/pesanan/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Gagal update status');
      await fetchOrders();
    } catch (e: any) {
      alert(e.message || 'Error update order');
    }
  };

  const handleOpenDetailPopup = (order: Pesanan) => {
    setOrderForDetail(order);
    setShowDetailPopup(true);
  };

  const handleCloseDetailPopup = () => {
    setShowDetailPopup(false);
    setOrderForDetail(null);
  };

  const formatVarianDetails = (varian: ProdukVarian) => {
    const details = [];
    if (varian.size) details.push(`Size ${varian.size}`);
    if (varian.thickness) details.push(`Tebal ${varian.thickness}mm`);
    if (varian.hole) details.push(`Lubang ${varian.hole}mm`);
    if (details.length === 0) return 'Standar';
    return details.join(' - ');
  };

  // (Popup pembatalan dan upload refund tetap diabaikan/placeholder)

  return (
    <div>
      <HeaderAdmin />
      <NavbarAdmin />
      <main style={{ minHeight: 700, background: '#2f3943', paddingTop: 90, paddingBottom: 100 }}>
        {orders.length === 0 && <p style={{ color: '#fff', textAlign: 'center' }}>No ongoing or completed orders.</p>}
        {orders.map((order) => (
          <div className={`${styles.order} ${order.status === 'DONE' ? styles.done : ''}`} key={order.id}>
            {/* Tanda Selesai */}
            {order.status === 'DONE' && <div className={styles.doneBadge}>SELESAI</div>}
            <img src={order.keranjang?.produkVarian?.produk?.gambar || '/no-img.png'} alt={order.keranjang?.produkVarian?.produk?.namaProduk || ''} />
            <div className={styles.detailOrder}>
              <h2>{order.keranjang?.produkVarian?.produk?.namaProduk || '-'}</h2>
              <div className={styles.detailUkuran}>
                <span className={styles.box}>
                  <b>Varian:</b> {formatVarianDetails(order.keranjang.produkVarian)}
                </span>
              </div>
              <p><b>Jumlah: {order.keranjang?.jumlah}</b></p>
              <p>Total Harga: Rp {((order.keranjang?.totalHarga || 0) + (order.ongkosKirim || 0)).toLocaleString()}</p>
              <div className={styles.statusPesanan}>
                <button
                  className={order.status === 'ON_PROCESS' ? styles.active : ''}
                  onClick={() => handleStatusChange(order.id, 'ON_PROCESS')}
                  disabled={order.status === 'ON_PROCESS' || order.status === 'DONE'}
                >
                  ON PROCESS
                </button>
                <button
                  className={order.status === 'ON_DELIVERY' ? styles.active : ''}
                  onClick={() => handleStatusChange(order.id, 'ON_DELIVERY')}
                  disabled={order.status === 'ON_DELIVERY' || order.status === 'DONE'}
                >
                  ON DELIVERY
                </button>
                <button
                  className={styles.doneBtn}
                  onClick={() => handleStatusChange(order.id, 'DONE')}
                  disabled={order.status === 'DONE'}
                >
                  DONE
                </button>
              </div>
              {/* Tombol Lihat Detail */}
              <button onClick={() => handleOpenDetailPopup(order)} className={styles.detailBtn}>
                Lihat Detail
              </button>
              {order.pembatalanPesanan && <></>}
            </div>
          </div>
        ))}
        {/* ==================== POPUP DETAIL PESANAN ==================== */}
        {showDetailPopup && orderForDetail && (
          <div className={styles.popup}>
            <div className={`${styles.popupContent} ${styles.detailPopupContent}`}>
              <span className={styles.closeBtn} onClick={handleCloseDetailPopup}>&times;</span>
              <h2>Detail Pesanan</h2>
              <div className={styles.detailGrid}>
                <div className={styles.detailSection}>
                  <h4>Informasi Pelanggan</h4>
                  <p><strong>Nama:</strong> {orderForDetail.user.nama}</p>
                  <p><strong>Telepon:</strong> {orderForDetail.nomorTelepon}</p>
                  <p><strong>Alamat:</strong> {`${orderForDetail.alamatDetail}, ${orderForDetail.kelurahan}, ${orderForDetail.kecamatan}, ${orderForDetail.kabupaten}, ${orderForDetail.provinsi}`}</p>
                </div>
                <div className={styles.detailSection}>
                  <h4>Informasi Pesanan</h4>
                  <p><strong>Produk:</strong> {orderForDetail.keranjang.produkVarian.produk.namaProduk}</p>
                  <p><strong>Varian:</strong> {formatVarianDetails(orderForDetail.keranjang.produkVarian)}</p>
                  <p><strong>Jumlah:</strong> {orderForDetail.keranjang.jumlah}</p>
                  <p><strong>Status:</strong> {orderForDetail.status}</p>
                </div>
                <div className={styles.detailSection}>
                  <h4>Informasi Pembayaran</h4>
                  <p><strong>Harga Satuan:</strong> Rp {orderForDetail.keranjang.produkVarian.harga.toLocaleString()}</p>
                  <p><strong>Subtotal:</strong> Rp {orderForDetail.keranjang.totalHarga.toLocaleString()}</p>
                  <p><strong>Ongkos Kirim:</strong> Rp {orderForDetail.ongkosKirim.toLocaleString()}</p>
                  <p><strong>Total Harga:</strong> Rp {((orderForDetail.keranjang.totalHarga || 0) + (orderForDetail.ongkosKirim || 0)).toLocaleString()}</p>
                  <p><strong>Bank:</strong> {orderForDetail.bankName} - {orderForDetail.accountName} ({orderForDetail.accountNumber})</p>
                  <a href={orderForDetail.buktiTransferUrl} target="_blank" rel="noopener noreferrer">Lihat Bukti Transfer</a>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ================================================================= */}
        {showCancelPopup && selectedOrder && <></>}
        {uploadRefund && <></>}
      </main>
      <FooterHitam />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import styles from './orders.module.css';
import HeaderAdmin from '@/app/headerAdmin';
import NavbarAdmin from '@/app/components/navbarAdmin';
import FooterHitam from '@/app/components/footerHitam';

interface Produk {
  id: string;
  namaProduk: string;
  gambar?: string;
}
interface ProdukVarian {
  id: string;
  produk: Produk;
  size?: string;
  thickness?: number;
  hole?: number;
  harga: number;
}
interface KeranjangBelanja {
  id: string;
  produkVarian: ProdukVarian;
  jumlah: number;
  totalHarga: number;
}
interface Pelanggan {
  id: string;
  nama: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  alamatDetail: string;
  nomorTelepon: string;
}
interface Pesanan {
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
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Pesanan[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Pesanan | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [declineNote, setDeclineNote] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token_admin');
    fetch('http://localhost:5001/api/pesanan', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data.data) ? data.data : []))
      .catch(() => setOrders([]));
  };

  const handleConfirmOrder = async (orderId: string) => {
    const token = localStorage.getItem('token_admin');
    try {
      const res = await fetch(`http://localhost:5001/api/pesanan/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'ON_PROCESS' })
      });
      if (!res.ok) throw new Error('Gagal konfirmasi pesanan');
      setSelectedOrder(null);
      await fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Gagal konfirmasi pesanan');
    }
  };

  const handleDeclineOrder = async (orderId: string) => {
    if (!declineNote.trim()) {
      alert('Mohon isi alasan penolakan');
      return;
    }
    const token = localStorage.getItem('token_admin');
    try {
      const res = await fetch(`http://localhost:5001/api/pesanan/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'CANCELLED', alasanPenolakan: declineNote })
      });
      if (!res.ok) throw new Error('Gagal decline/cancel pesanan');
      setSelectedOrder(null);
      setDeclineNote('');
      await fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Gagal decline pesanan');
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <NavbarAdmin />
      <div className={styles['order-list']}>
        {orders.map((order) => {
          const isRejected = order.status === 'CANCELLED' && !!order.alasanPenolakan;
          const isConfirmed = order.status === 'ON_PROCESS';
          return (
            <div
              className={styles['order-card']}
              key={order.id}
            >
              <div className={styles['order-card-img']}>
                <img
                  src={order.keranjang?.produkVarian?.produk?.gambar || '/no-img.png'}
                  alt={order.keranjang?.produkVarian?.produk?.namaProduk || ''}
                />
              </div>
              <div className={styles['order-card-content']}>
                <div className={styles['order-card-desc']}>
                  <h3>
                    {order.keranjang?.produkVarian?.produk?.namaProduk}
                    {isRejected && (
                      <span className={styles['badge-rejected']}>ORDER DITOLAK</span>
                    )}
                    {isConfirmed && (
                      <span className={styles['badge-confirmed']}>ORDER DIKONFIRMASI</span>
                    )}
                  </h3>
                  <p>Price : Rp {order.keranjang?.produkVarian?.harga?.toLocaleString()}</p>
                  <p>Amount : {order.keranjang?.jumlah}</p>
                </div>
                <div className={styles['button-wrap']}>
                  <button
                    className={styles['detail-btn']}
                    onClick={() => { setSelectedOrder(order); setDeclineNote(''); }}
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* POPUP DETAIL */}
        {selectedOrder && (
          <div className={styles['popup-overlay']} style={{ zIndex: 9999 }} onClick={() => { setSelectedOrder(null); setDeclineNote(''); }}>
            <div className={styles['popup-content']} onClick={e => e.stopPropagation()}>
              <span className={styles['close-popup']} onClick={() => { setSelectedOrder(null); setDeclineNote(''); }}>&times;</span>
              <div className={styles['popup-wrapper']}>
                <div className={styles['popup-title']}>
                  <h3>
                    {selectedOrder.keranjang?.produkVarian?.produk?.namaProduk}
                    {selectedOrder.status === "CANCELLED" && !!selectedOrder.alasanPenolakan && (
                      <span className={styles['badge-rejected']}>ORDER DITOLAK</span>
                    )}
                    {selectedOrder.status === "ON_PROCESS" && (
                      <span className={styles['badge-confirmed']}>ORDER DIKONFIRMASI</span>
                    )}
                  </h3>
                </div>
                <div className={styles['popup-line-one']}>
                  <div className={styles['popup-img']}>
                    <img src={selectedOrder.keranjang?.produkVarian?.produk?.gambar || '/no-img.png'} alt="Product" />
                  </div>
                  <div className={styles['popup-cusinfo']}>
                    <div className={styles['popup-cusinfo-title']}>
                      <p><strong>Name</strong></p>
                      <p><strong>Bank Name</strong></p>
                      <p><strong>Account Holder's Name</strong></p>
                      <p><strong>Bank Account</strong></p>
                      <p><strong>Province</strong></p>
                      <p><strong>City</strong></p>
                      <p><strong>District</strong></p>
                      <p><strong>Urban Village</strong></p>
                      <p><strong>Detail Address</strong></p>
                      <p><strong>Phone Number</strong></p>
                    </div>
                    <div className={styles['popup-cusinfo-content']}>
                      <p>{selectedOrder.user?.nama}</p>
                      <p>{selectedOrder.bankName}</p>
                      <p>{selectedOrder.accountName}</p>
                      <p>{selectedOrder.accountNumber}</p>
                      <p>{selectedOrder.provinsi}</p>
                      <p>{selectedOrder.kabupaten}</p>
                      <p>{selectedOrder.kecamatan}</p>
                      <p>{selectedOrder.kelurahan}</p>
                      <p>{selectedOrder.alamatDetail}</p>
                      <p>{selectedOrder.nomorTelepon}</p>
                    </div>
                  </div>
                </div>
                <div className={styles['popup-line-two']}>
                  <div className={styles['popup-productinfo']}>
                    <div className={styles['popup-productinfo-title']}>
                      {selectedOrder.keranjang?.produkVarian?.thickness ? <p><strong>Thickness</strong></p> : null}
                      {selectedOrder.keranjang?.produkVarian?.size ? <p><strong>Size</strong></p> : null}
                      {selectedOrder.keranjang?.produkVarian?.hole ? <p><strong>Hole</strong></p> : null}
                      <p><strong>Harga Produk</strong></p>
                      <p><strong>Ongkos Kirim</strong></p>
                      <p><strong>Total Price</strong></p>
                      <p><strong>Transfer Receipt</strong></p>
                    </div>
                    <div className={styles['popup-productinfo-content']}>
                      {selectedOrder.keranjang?.produkVarian?.thickness ? (
                        <p>{selectedOrder.keranjang?.produkVarian?.thickness}</p>
                      ) : null}
                      {selectedOrder.keranjang?.produkVarian?.size ? (
                        <p>{selectedOrder.keranjang?.produkVarian?.size}</p>
                      ) : null}
                      {selectedOrder.keranjang?.produkVarian?.hole ? (
                        <p>{selectedOrder.keranjang?.produkVarian?.hole}</p>
                      ) : null}
                      <p>Rp {selectedOrder.keranjang?.totalHarga?.toLocaleString()}</p>
                      <p>Rp {selectedOrder.ongkosKirim?.toLocaleString()}</p>
                      <p>
                        <b>
                          Rp{' '}
                          {(
                            (selectedOrder.keranjang?.totalHarga || 0) +
                            (selectedOrder.ongkosKirim || 0)
                          ).toLocaleString()}
                        </b>
                      </p>
                      <p>
                        <button
                          className={styles['see-receipt-btn']}
                          onClick={() => setShowReceipt(true)}
                        >
                          see receipt
                        </button>
                      </p>
                    </div>
                  </div>
                  {/* Status Confirm & Decline Buttons */}
                  <div className={styles['popup-confirm-btn']}>
                    <button
                      className={styles['confirm-btn']}
                      onClick={() => handleConfirmOrder(selectedOrder.id)}
                      disabled={
                        selectedOrder.status === "CANCELLED" ||
                        selectedOrder.status === "ON_PROCESS"
                      }
                    >
                      Confirm Order
                    </button>
                  </div>
                  <div className={styles['popup-tyoe-text']}>
                    <p><strong>Something is wrong?</strong></p>
                    <input
                      type="text"
                      placeholder="Type here"
                      className={styles['text-type']}
                      value={declineNote}
                      onChange={e => setDeclineNote(e.target.value)}
                      disabled={
                        selectedOrder.status === "CANCELLED" ||
                        selectedOrder.status === "ON_PROCESS"
                      }
                    />
                  </div>
                  <div className={styles['popup-decline-btn']}>
                    <button
                      className={styles['decline-btn']}
                      onClick={() => handleDeclineOrder(selectedOrder.id)}
                      disabled={
                        selectedOrder.status === "CANCELLED" ||
                        selectedOrder.status === "ON_PROCESS"
                      }
                    >
                      Decline Order
                    </button>
                  </div>
                </div>
                {/* Badge alasan penolakan */}
                {selectedOrder.status === "CANCELLED" && selectedOrder.alasanPenolakan && (
                  <div className={styles.alasanRejected}>
                    <b>Ditolak:</b> {selectedOrder.alasanPenolakan}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* POPUP GAMBAR BUKTI TRANSFER */}
        {showReceipt && selectedOrder && (
          <div className={styles['popup-overlay']} style={{ zIndex: 10000 }} onClick={() => setShowReceipt(false)}>
            <div className={styles['popup-content']}
              style={{
                maxWidth: 500,
                maxHeight: '90vh',
                overflow: 'auto',
                background: 'white',
                color: 'black',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
              onClick={e => e.stopPropagation()}
            >
              <span className={styles['close-popup']} style={{ color: 'black', top: 8, right: 16, position: 'absolute' }} onClick={() => setShowReceipt(false)}>&times;</span>
              <img src={selectedOrder.buktiTransferUrl} alt="Receipt" style={{ width: 360, height: 'auto', borderRadius: 8, marginBottom: 20 }} />
              <a
                href={selectedOrder.buktiTransferUrl}
                download={`bukti-transfer-${selectedOrder.id}.jpg`}
                style={{
                  display: 'inline-block',
                  background: '#2d3640',
                  color: 'white',
                  borderRadius: 8,
                  padding: '8px 24px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  marginTop: 8,
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Bukti Transfer
              </a>
            </div>
          </div>
        )}
      </div>
      <FooterHitam />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import styles from './orders.module.css';
import HeaderAdmin from '@/app/headerAdmin';
import FooterHitam from '@/app/components/footerHitam';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

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

interface PembatalanPesanan {
  id: string;
  pesananId: string;
  userId: string;
  alasanPembatalan: string;
  tanggalPengajuan: string; 
  statusPembatalan: 'menunggu' | 'disetujui' | 'ditolak';
  tanggalDirespon?: string; 
  catatanAdmin?: string;
  refundStatus: 'belum_diproses' | 'diproses' | 'selesai';
  jumlahRefund: number;
}

interface Pesanan {
  id: string;
  user: Pelanggan;
  keranjang: KeranjangBelanja;
  status: string; // 'PENDING' | 'ON_PROCESS' | 'ON_DELIVERY' | 'DONE' | 'CANCELLED'
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
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Pesanan[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Pesanan | null>(null);
  const [selectedCancellationRequest, setSelectedCancellationRequest] = useState<PembatalanPesanan | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [declineNote, setDeclineNote] = useState('');
  const [adminCancellationNote, setAdminCancellationNote] = useState('');

  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState('');
  const [statusPopupType, setStatusPopupType] = useState<'success' | 'error' | 'info'>('info');

  const [associatedOrderForCancellation, setAssociatedOrderForCancellation] = useState<Pesanan | null>(null);

  const showStatusMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setStatusPopupMessage(message);
    setStatusPopupType(type);
    setShowStatusPopup(true);
    setTimeout(() => {
      setShowStatusPopup(false);
    }, 3000);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedCancellationRequest) {
      const foundOrder = orders.find(order => order.id === selectedCancellationRequest.pesananId);
      setAssociatedOrderForCancellation(foundOrder || null);
    } else {
      setAssociatedOrderForCancellation(null);
    }
  }, [selectedCancellationRequest, orders]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token_admin');
    if (!token) {
        showStatusMessage('Anda tidak memiliki izin admin. Silakan login sebagai admin.', 'error');
        setOrders([]);
        return;
    }

    try {
      const ordersRes = await fetch(`${API_BASE_URL}/pesanan`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!ordersRes.ok) {
        const errorText = await ordersRes.text();
        console.error(`Failed to fetch orders: ${ordersRes.status} - ${ordersRes.statusText}`, errorText);
        throw new Error(`Gagal mengambil pesanan: ${ordersRes.status} ${ordersRes.statusText}`);
      }
      const ordersData = await ordersRes.json();

      const cancellationsRes = await fetch(`${API_BASE_URL}/pembatalan`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!cancellationsRes.ok) {
        const errorText = await cancellationsRes.text();
        console.error(`Failed to fetch cancellation requests: ${cancellationsRes.status} - ${cancellationsRes.statusText}`, errorText);
        throw new Error(`Gagal mengambil permintaan pembatalan: ${cancellationsRes.status} ${cancellationsRes.statusText}`);
      }
      const cancellationsData = await cancellationsRes.json();

      const ordersArray = Array.isArray(ordersData.data) ? ordersData.data : [];
      const cancellationsArray = Array.isArray(cancellationsData.data) ? cancellationsData.data : [];

      // Map cancellation requests to their respective orders
      const ordersWithCancellations = ordersArray.map((order: Pesanan) => {
        const cancellation = cancellationsArray.find((req: PembatalanPesanan) => req.pesananId === order.id);
        return {
          ...order,
          pembatalanPesanan: cancellation || undefined,
        };
      });

      const filteredOrders = ordersWithCancellations.filter((order: Pesanan) =>
        order.status !== 'ON_DELIVERY' && order.status !== 'DONE'
      );

      setOrders(filteredOrders);
    } catch (err: any) {
      console.error("Error in fetchOrders:", err);
      showStatusMessage(err.message || 'Gagal mengambil data pesanan.', 'error');
      setOrders([]);
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    const token = localStorage.getItem('token_admin');
    if (!token) {
        showStatusMessage('Anda tidak memiliki izin admin.', 'error');
        return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/pesanan/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'ON_PROCESS' })
      });

      if (!res.ok) {
        const errorBody = await res.json();
        console.error(`Gagal konfirmasi pesanan: ${res.status} - ${res.statusText}`, errorBody);
        throw new Error(errorBody.message || `Gagal konfirmasi pesanan. Status: ${res.status}`);
      }
      setSelectedOrder(null);
      await fetchOrders();
      showStatusMessage('Pesanan berhasil dikonfirmasi dan statusnya diperbarui!', 'success');
    } catch (err: any) {
      showStatusMessage(err.message || 'Gagal konfirmasi pesanan', 'error');
    }
  };

  const handleDeclineOrder = async (orderId: string) => {
    if (!declineNote.trim()) {
      showStatusMessage('Mohon isi alasan penolakan', 'info');
      return;
    }
    const token = localStorage.getItem('token_admin');
    if (!token) {
        showStatusMessage('Anda tidak memiliki izin admin.', 'error');
        return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/pesanan/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'CANCELLED', alasanPenolakan: declineNote })
      });
      if (!res.ok) {
        const errorBody = await res.json();
        console.error(`Gagal decline/cancel pesanan: ${res.status} - ${res.statusText}`, errorBody);
        throw new Error(errorBody.message || `Gagal decline/cancel pesanan. Status: ${res.status}`);
      }
      setSelectedOrder(null);
      setDeclineNote('');
      await fetchOrders(); 
      showStatusMessage('Pesanan berhasil ditolak!', 'success');
    } catch (err: any) {
      showStatusMessage(err.message || 'Gagal decline pesanan', 'error');
    }
  };

  const handleApproveCancellation = async (cancellationId: string, orderId: string) => {
    const token = localStorage.getItem('token_admin');
    if (!token) {
        showStatusMessage('Anda tidak memiliki izin admin.', 'error');
        return;
    }
    try {
      const totalRefundAmount = (associatedOrderForCancellation?.keranjang?.totalHarga || 0) + (associatedOrderForCancellation?.ongkosKirim || 0);

      const cancellationRes = await fetch(`${API_BASE_URL}/pembatalan/${cancellationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          statusPembatalan: 'disetujui',
          catatanAdmin: adminCancellationNote.trim() || 'Permintaan pembatalan disetujui.',
          tanggalDirespon: new Date().toISOString(),
          refundStatus: 'diproses',
          jumlahRefund: totalRefundAmount
        })
      });

      if (!cancellationRes.ok) {
        const errorBody = await cancellationRes.json();
        console.error(`Gagal menyetujui pembatalan: ${cancellationRes.status} - ${cancellationRes.statusText}`, errorBody);
        throw new Error(errorBody.message || `Gagal menyetujui pembatalan. Status: ${cancellationRes.status}`);
      }
      
      const orderRes = await fetch(`${API_BASE_URL}/pesanan/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'CANCELLED',
          alasanPenolakan: adminCancellationNote.trim() || 'Pembatalan disetujui oleh admin.'
        })
      });

      if (!orderRes.ok) {
        const errorBody = await orderRes.json();
        console.error(`Gagal mengupdate status pesanan setelah pembatalan: ${orderRes.status} - ${orderRes.statusText}`, errorBody);
        throw new Error(errorBody.message || `Gagal mengupdate status pesanan. Status: ${orderRes.status}`);
      }

      setSelectedCancellationRequest(null);
      setAdminCancellationNote('');
      await fetchOrders();
      showStatusMessage('Pembatalan berhasil disetujui dan pesanan dibatalkan!', 'success');
    } catch (err: any) {
      showStatusMessage(err.message || 'Gagal menyetujui pembatalan', 'error');
    }
  };

  const handleRejectCancellation = async (cancellationId: string, orderId: string) => {
    if (!adminCancellationNote.trim()) {
      showStatusMessage('Mohon isi catatan admin untuk penolakan pembatalan', 'info');
      return;
    }
    const token = localStorage.getItem('token_admin');
    if (!token) {
        showStatusMessage('Anda tidak memiliki izin admin.', 'error');
        return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/pembatalan/${cancellationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          statusPembatalan: 'ditolak',
          catatanAdmin: adminCancellationNote.trim(),
          tanggalDirespon: new Date().toISOString()
        })
      });
      if (!res.ok) {
        const errorBody = await res.json();
        console.error(`Gagal menolak pembatalan: ${res.status} - ${res.statusText}`, errorBody);
        throw new Error(errorBody.message || `Gagal menolak pembatalan. Status: ${res.status}`);
      }

      setSelectedCancellationRequest(null);
      setAdminCancellationNote('');
      await fetchOrders(); 
      showStatusMessage('Permintaan pembatalan berhasil ditolak! Pesanan berlanjut.', 'success');
    } catch (err: any) {
      showStatusMessage(err.message || 'Gagal menolak pembatalan', 'error');
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <div className={styles['order-list']}>
        {orders.length === 0 && (
            <p className={styles.noOrdersMessage}>Tidak ada pesanan yang perlu perhatian.</p>
        )}

        {orders.map((order: Pesanan) => {
          const isPending = order.status === 'PENDING';
          const isOnProcess = order.status === 'ON_PROCESS';
          const isCancelled = order.status === 'CANCELLED'; 
          const isCancellationRequested = order.pembatalanPesanan?.statusPembatalan === 'menunggu'; 
          const isCancellationRejected = order.pembatalanPesanan?.statusPembatalan === 'ditolak'; 
          const isCancellationApproved = order.pembatalanPesanan?.statusPembatalan === 'disetujui';

          return (
            <div
              className={`${styles['order-card']} 
                ${isCancelled ? styles['rejectedOrderCard'] : ''} 
                ${isCancellationRequested ? styles['cancelRequestedOrderCard'] : ''} 
                ${isOnProcess ? styles['onProcessOrderCard'] : ''}
                ${isCancellationApproved ? styles['approvedCancellationOrderCard'] : ''} // NEW: Style for approved cancellation
                ${isCancellationRejected ? styles['rejectedCancellationOrderCard'] : ''} // NEW: Style for rejected cancellation
              `}
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
                    {isCancelled && (
                      <span className={styles['badge-rejected']}>ORDER DITOLAK</span>
                    )}
                    {isPending && (
                      <span className={styles['badge-pending']}>ORDER PENDING</span>
                    )}
                    {isOnProcess && (
                      <span className={styles['badge-confirmed']}>ON PROCESS</span>
                    )}
                    {isCancellationRequested && (
                      <span className={styles['badge-cancel-requested']}>PEMBATALAN DIMINTA</span>
                    )}
                    {isCancellationRejected && (
                      <span className={styles['badge-cancellation-rejected']}>PEMBATALAN DITOLAK</span>
                    )}
                    {isCancellationApproved && ( 
                      <span className={styles['badge-cancellation-approved']}>PEMBATALAN DISETUJUI</span>
                    )}
                  </h3>
                  <p>Price : Rp {order.keranjang?.produkVarian?.harga?.toLocaleString()}</p>
                  <p>Amount : {order.keranjang?.jumlah}</p>
                  {isCancelled && order.alasanPenolakan && (
                    <p className={styles['alasan-rejected']}>
                      <b>Pesan:</b> {order.alasanPenolakan}
                    </p>
                  )}
                  {isCancellationRequested && (
                    <p className={styles['alasan-cancel-requested']}>
                      <b>Permintaan Pembatalan:</b> {order.pembatalanPesanan?.alasanPembatalan}
                    </p>
                  )}
                  {isCancellationRejected && order.pembatalanPesanan?.catatanAdmin && (
                    <p className={styles['alasan-cancellation-rejected']}>
                      <b>Pesan:</b> {order.pembatalanPesanan.catatanAdmin}
                    </p>
                  )}
                  {isCancellationApproved && order.pembatalanPesanan?.catatanAdmin && ( 
                    <p className={styles['alasan-cancellation-approved']}>
                      <b>Pembatalan Disetujui Admin:</b> {order.pembatalanPesanan.catatanAdmin}
                    </p>
                  )}
                </div>
                <div className={styles['button-wrap']}>
                  <button
                    className={styles['detail-btn']}
                    onClick={() => {
                      if (isCancellationRequested) {
                        setSelectedCancellationRequest(order.pembatalanPesanan!);
                        setSelectedOrder(null);
                      } else {
                        setSelectedOrder(order);
                        setSelectedCancellationRequest(null);
                        setDeclineNote('');
                      }
                    }}
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* POPUP DETAIL PESANAN */}
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
                      <span className={styles['badge-confirmed']}>ON PROCESS</span>
                    )}
                    {selectedOrder.pembatalanPesanan?.statusPembatalan === 'ditolak' && (
                        <span className={styles['badge-cancellation-rejected']}>PEMBATALAN DITOLAK</span>
                    )}
                    {selectedOrder.pembatalanPesanan?.statusPembatalan === 'disetujui' && ( // NEW: Badge in detail popup
                        <span className={styles['badge-cancellation-approved']}>PEMBATALAN DISETUJUI</span>
                    )}
                    {selectedOrder.status === "PENDING" && (
                        <span className={styles['badge-pending']}>ORDER PENDING</span>
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
                  <div className={styles['popup-confirm-decline-btns']}>
                    {(() => {
                      const isSelectedOrderCancelled = selectedOrder.status === "CANCELLED";
                      const isSelectedOrderOnProcess = selectedOrder.status === "ON_PROCESS";
                      const isSelectedOrderOnDelivery = selectedOrder.status === "ON_DELIVERY";
                      const isSelectedOrderDone = selectedOrder.status === "DONE";
                      const isSelectedOrderCancellationRequested = selectedOrder.pembatalanPesanan?.statusPembatalan === 'menunggu';

                      const disableButtons = isSelectedOrderCancelled || isSelectedOrderOnProcess || isSelectedOrderOnDelivery || isSelectedOrderDone || isSelectedOrderCancellationRequested;

                      return (
                        <>
                          <button
                            className={styles['confirm-btn']}
                            onClick={() => handleConfirmOrder(selectedOrder.id)}
                            disabled={disableButtons}
                          >
                            Confirm Order
                          </button>
                          <input
                            type="text"
                            placeholder="Alasan penolakan..."
                            className={styles['text-type']}
                            value={declineNote}
                            onChange={e => setDeclineNote(e.target.value)}
                            disabled={disableButtons}
                          />
                          <button
                            className={styles['decline-btn']}
                            onClick={() => handleDeclineOrder(selectedOrder.id)}
                            disabled={disableButtons}
                          >
                            Decline Order
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
                {selectedOrder.status === "CANCELLED" && selectedOrder.alasanPenolakan && (
                  <div className={styles.alasanRejected}>
                    <b>Ditolak Admin:</b> {selectedOrder.alasanPenolakan}
                  </div>
                )}
                {selectedOrder.pembatalanPesanan?.statusPembatalan === 'ditolak' && selectedOrder.pembatalanPesanan?.catatanAdmin && (
                    <div className={styles.alasanCancellationRejected}>
                        <b>Pembatalan Ditolak:</b> {selectedOrder.pembatalanPesanan.catatanAdmin}
                    </div>
                )}
                {selectedOrder.pembatalanPesanan?.statusPembatalan === 'disetujui' && selectedOrder.pembatalanPesanan?.catatanAdmin && ( // NEW: Reason for approved cancellation
                    <div className={styles.alasanCancellationApproved}>
                        <b>Pembatalan Disetujui:</b> {selectedOrder.pembatalanPesanan.catatanAdmin}
                    </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* POPUP DETAIL PEMBATALAN PESANAN */}
        {selectedCancellationRequest && (
          <div className={styles['popup-overlay']} style={{ zIndex: 9999 }} onClick={() => { setSelectedCancellationRequest(null); setAdminCancellationNote(''); }}>
            <div className={styles['popup-content']} onClick={e => e.stopPropagation()}>
              <span className={styles['close-popup']} onClick={() => { setSelectedCancellationRequest(null); setAdminCancellationNote(''); }}>&times;</span>
              <div className={styles['popup-wrapper']}>
                <div className={styles['popup-title']}>
                  <h3>Permintaan Pembatalan Pesanan</h3>
                </div>
                {associatedOrderForCancellation && (
                  <div className={styles['popup-cancellation-order-detail']}>
                    <h4>Detail Pesanan Terkait:</h4>
                    <p><strong>Produk:</strong> {associatedOrderForCancellation.keranjang?.produkVarian?.produk?.namaProduk}</p>
                    <p><strong>Jumlah:</strong> {associatedOrderForCancellation.keranjang?.jumlah}</p>
                    <p><strong>Harga Produk:</strong> Rp {associatedOrderForCancellation.keranjang?.totalHarga?.toLocaleString()}</p>
                    <p><strong>Ongkos Kirim:</strong> Rp {associatedOrderForCancellation.ongkosKirim?.toLocaleString()}</p>
                    <p><strong>Total Pembayaran:</strong> Rp {((associatedOrderForCancellation.keranjang?.totalHarga || 0) + (associatedOrderForCancellation.ongkosKirim || 0)).toLocaleString()}</p>
                    <p><strong>Status Pesanan Saat Ini:</strong> {associatedOrderForCancellation.status}</p>
                    {associatedOrderForCancellation.buktiTransferUrl && (
                      <p>
                        <strong>Bukti Transfer:</strong>{' '}
                        <button
                          className={styles['see-receipt-btn']}
                          onClick={() => {
                            setSelectedOrder(associatedOrderForCancellation);
                            setShowReceipt(true);
                          }}
                        >
                          lihat bukti
                        </button>
                      </p>
                    )}
                    <hr className={styles.divider} />
                  </div>
                )}
                <div className={styles['popup-cancellation-info']}>
                  <h4>Detail Permintaan Pembatalan:</h4>
                  <p><strong>ID Permintaan Pembatalan:</strong> {selectedCancellationRequest.id}</p>
                  <p><strong>ID Pesanan:</strong> {selectedCancellationRequest.pesananId}</p>
                  <p><strong>Alasan Pembatalan:</strong> {selectedCancellationRequest.alasanPembatalan}</p>
                  <p><strong>Tanggal Pengajuan:</strong> {new Date(selectedCancellationRequest.tanggalPengajuan).toLocaleString()}</p>
                  <p><strong>Status Permintaan:</strong> {selectedCancellationRequest.statusPembatalan}</p>
                  {selectedCancellationRequest.statusPembatalan !== 'menunggu' && selectedCancellationRequest.catatanAdmin && (
                    <p><strong>Catatan Admin:</strong> {selectedCancellationRequest.catatanAdmin}</p>
                  )}
                </div>
                {selectedCancellationRequest.statusPembatalan === 'menunggu' && (
                  <>
                    <div className={styles['popup-admin-note']}>
                      <p><strong>Catatan Admin (opsional):</strong></p>
                      <input
                        type="text"
                        placeholder="Tambahkan catatan untuk pelanggan..."
                        className={styles['text-type']}
                        value={adminCancellationNote}
                        onChange={e => setAdminCancellationNote(e.target.value)}
                      />
                    </div>
                    <div className={styles['popup-actions']}>
                      <button
                        className={styles['confirm-btn']}
                        onClick={() => handleApproveCancellation(selectedCancellationRequest.id, selectedCancellationRequest.pesananId)}
                      >
                        Setujui Pembatalan
                      </button>
                      <button
                        className={styles['decline-btn']}
                        onClick={() => handleRejectCancellation(selectedCancellationRequest.id, selectedCancellationRequest.pesananId)}
                      >
                        Tolak Pembatalan
                      </button>
                    </div>
                  </>
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

        {/* Custom Status Popup */}
        {showStatusPopup && (
          <div className={styles['status-popup-overlay']} onClick={() => setShowStatusPopup(false)}>
            <div className={`${styles['status-popup-content']} ${styles[statusPopupType]}`} onClick={e => e.stopPropagation()}>
              <p>{statusPopupMessage}</p>
              <button onClick={() => setShowStatusPopup(false)} className={styles['status-popup-close']}>&times;</button>
            </div>
          </div>
        )}

      </div>
      <FooterHitam />
    </div>
  );
}
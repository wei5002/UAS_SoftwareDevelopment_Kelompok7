'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from './order.module.css';
import Header from '@/app/header';
import Navbar from '@/app/components/navbar';
import FooterHitam from '@/app/components/footerHitam';
import CancelModal from './components/CancelModal';

// Tipe data
type StatusPesanan = 'PENDING' | 'ON_PROCESS' | 'ON_DELIVERY' | 'DONE' | 'CANCELLED';
type StatusPembatalan = 'menunggu' | 'disetujui' | 'ditolak';

type ProdukVarian = {
    id: string;
    produkId: string;
    size?: string;
    thickness?: number;
    hole?: number;
    harga: number;
    stok: number;
    produk: {
        id: string;
        namaProduk: string;
        kategori: string;
        gambar?: string;
    };
};

type KeranjangBelanja = {
    id: string;
    userId: string;
    produkVarianId: string;
    jumlah: number;
    totalHarga: number;
    produkVarian: ProdukVarian;
};

type Pembatalan = {
    id: string;
    statusPembatalan: StatusPembatalan;
}

type Pesanan = {
    id: string;
    userId: string;
    tanggalPemesanan: string;
    status: StatusPesanan;
    alamatDetail: string;
    provinsi: string;
    kabupaten: string;
    kecamatan: string;
    kelurahan: string;
    nomorTelepon: string;
    keranjangId: string;
    keranjang: KeranjangBelanja;
    bankName: string;
    accountName: string;
    accountNumber: number;
    buktiTransferUrl: string;
    ongkosKirim: number;
    user: {
        nama: string;
    };
    pembatalanPesanan?: Pembatalan;
};

export default function OrderPage() {
    const [orders, setOrders] = useState<Pesanan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<Pesanan | null>(null);

    const [showDetailPopup, setShowDetailPopup] = useState(false);
    const [orderForDetail, setOrderForDetail] = useState<Pesanan | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('customer_token');
            if (!token) throw new Error("Autentikasi dibutuhkan. Silakan login kembali.");

            const response = await fetch('http://localhost:5001/api/pesanan/my', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors || 'Gagal mengambil data pesanan.');
            }

            const result = await response.json();
            setOrders(result.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleOpenDetailPopup = (order: Pesanan) => {
        setOrderForDetail(order);
        setShowDetailPopup(true);
    };

    const handleCloseDetailPopup = () => {
        setShowDetailPopup(false);
        setOrderForDetail(null);
    };

    const handleOpenCancelModal = (order: Pesanan) => {
        setSelectedOrderForCancel(order);
        setIsCancelModalOpen(true);
    };

    const handleCloseCancelModal = () => {
        setSelectedOrderForCancel(null);
        setIsCancelModalOpen(false);
    };
    
    const handleCancelSuccess = () => {
        fetchOrders();
        handleCloseCancelModal();
    };

    const formatVarianDetails = (varian: ProdukVarian) => {
        const details = [];
        if (varian.size) details.push(`Size ${varian.size}`);
        if (varian.thickness) details.push(`Tebal ${varian.thickness}mm`);
        if (varian.hole) details.push(`Lubang ${varian.hole}mm`);
        if(details.length === 0) return "Standar";
        return details.join(' - ');
    };

    const handleOrderDone = async (orderId: string) => {
        if (!window.confirm("Apakah Anda yakin telah menerima pesanan ini?")) {
            return;
        }

        try {
            const token = localStorage.getItem('customer_token');
            if (!token) throw new Error("Autentikasi dibutuhkan. Silakan login kembali.");

            const response = await fetch(`http://localhost:5001/api/pesanan/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: 'DONE' }),
            });

            if (!response.ok) {
                let errorMessage = 'Gagal menyelesaikan pesanan.';
                // (Error handling tidak berubah)
                throw new Error(errorMessage);
            }

            alert("Pesanan telah ditandai sebagai selesai.");
            fetchOrders();

        } catch (err: any) {
            alert(err.message);
            console.error(err);
        }
    };

    const getCancelButtonText = (status?: StatusPembatalan) => {
        switch (status) {
            case 'menunggu': return 'Cancel Pending';
            case 'disetujui': return 'Cancelled';
            case 'ditolak': return 'Cancel Rejected';
            default: return 'Cancel';
        }
    };

    return (
        <>
            <Head>
                <title>Pesanan Saya</title>
            </Head>
            <Header />
            <Navbar />
            <div className={styles.orderList}>
                {loading && <p>Memuat pesanan...</p>}
                {error && <p className={styles.errorText}>{error}</p>}
                {!loading && !error && orders.length === 0 && <p>Anda belum memiliki pesanan.</p>}
                
                {orders.map((order) => {
                    const cancellationStatus = order.pembatalanPesanan?.statusPembatalan;
                    const canBeCancelled = (order.status === 'PENDING' || order.status === 'ON_PROCESS') && !cancellationStatus;
                    const canBeMarkedDone = order.status === 'ON_DELIVERY' && cancellationStatus !== 'disetujui';

                    // ==================== PERUBAHAN DI SINI ====================
                    // Menambahkan kelas 'done' jika status pesanan selesai
                    const cardClasses = [
                        styles.orderCard,
                        order.status === 'DONE' ? styles.done : '',
                        cancellationStatus ? styles[`cancellation_${cancellationStatus}`] : ''
                    ].join(' ');

                    return (
                        <div key={order.id} className={cardClasses}>
                             {cancellationStatus === 'disetujui' && (
                                <div className={`${styles.statusOverlay} ${styles.cancelled}`}>
                                    PESANAN DIBATALKAN
                                </div>
                            )}
                             {/* Mengganti overlay dengan badge */}
                             {order.status === 'DONE' && (
                                <div className={styles.doneBadge}>
                                    SELESAI
                                </div>
                            )}
                            {/* ========================================================= */}
                            <div className={styles.orderCardImg}>
                                <img 
                                    src={order.keranjang.produkVarian.produk.gambar || 'https://placehold.co/200x200/2d3640/FFFFFF?text=Gambar'} 
                                    alt={order.keranjang.produkVarian.produk.namaProduk}
                                />
                            </div>
                            <div className={styles.orderCardContent}>
                                <div className={styles.buttonWrapTop}>
                                    <button 
                                        className={styles.cancelBtn}
                                        onClick={() => handleOpenCancelModal(order)}
                                        disabled={!canBeCancelled}
                                    >
                                        {getCancelButtonText(cancellationStatus)}
                                    </button>
                                    <button 
                                        className={styles.doneBtn}
                                        onClick={() => handleOrderDone(order.id)}
                                        disabled={!canBeMarkedDone}
                                    >
                                        Done
                                    </button>
                                </div>
                                <div className={styles.orderCardDesc}>
                                    <h3>{order.keranjang.produkVarian.produk.namaProduk}</h3>
                                    <div className={styles.orderCardSizeWrap}>
                                        <div className={styles.orderCardSize}>
                                            <p>{formatVarianDetails(order.keranjang.produkVarian)}</p>
                                        </div>
                                    </div>
                                    <p>Total Harga: Rp {(order.keranjang.totalHarga + order.ongkosKirim).toLocaleString()}</p>
                                    <p>Jumlah : <span className={styles.amountValue}>{order.keranjang.jumlah}</span></p>
                                </div>
                                 <div className={styles.buttonWrapBottom}>
                                    <button className={`${styles.statusBtn} ${order.status === 'PENDING' ? styles.active : ''}`}>
                                        Pending
                                    </button>
                                    <button className={`${styles.statusBtn} ${order.status === 'ON_PROCESS' ? styles.active : ''}`}>
                                        On Process
                                    </button>
                                    <button className={`${styles.statusBtn} ${order.status === 'ON_DELIVERY' ? styles.active : ''}`}>
                                        On Delivery
                                    </button>
                                    <button onClick={() => handleOpenDetailPopup(order)} className={styles.detailBtn}>
                                        Lihat Detail
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isCancelModalOpen && selectedOrderForCancel && (
                <CancelModal
                    isOpen={isCancelModalOpen}
                    onClose={handleCloseCancelModal}
                    onSuccess={handleCancelSuccess}
                    order={selectedOrderForCancel}
                />
            )}

            {showDetailPopup && orderForDetail && (
                <div className={styles.popup}>
                    <div className={`${styles.popupContent} ${styles.detailPopupContent}`}>
                        <span className={styles.closeBtn} onClick={handleCloseDetailPopup}>&times;</span>
                        <h2>Detail Pesanan Anda</h2>
                        <div className={styles.detailGrid}>
                            <div className={styles.detailSection}>
                                <h4>Informasi Pengiriman</h4>
                                <p><strong>Nama Penerima:</strong> {orderForDetail.user.nama}</p>
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
                                <a href={orderForDetail.buktiTransferUrl} target="_blank" rel="noopener noreferrer">Lihat Bukti Transfer</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <FooterHitam />
        </>
    );
}

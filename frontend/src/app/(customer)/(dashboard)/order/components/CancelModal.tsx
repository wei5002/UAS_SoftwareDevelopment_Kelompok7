'use client';

import React, { useState, useEffect } from 'react';
import styles from './CancelModal.module.css';

type Pesanan = {
    id: string;
    bankName: string;
    accountName: string;
    accountNumber: number;
};

type CancelModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    order: Pesanan;
};

export default function CancelModal({ isOpen, onClose, onSuccess, order }: CancelModalProps) {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState(''); // State untuk nama pelanggan

    // Ambil nama pelanggan dari localStorage (KHUSUS CUSTOMER)
    useEffect(() => {
        if (isOpen) {
            const nama = localStorage.getItem('customer_nama');
            setCustomerName(nama || 'Nama tidak ditemukan');
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!reason.trim()) {
            setError('Alasan pembatalan wajib diisi.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // AMBIL TOKEN KHUSUS CUSTOMER
            const token = localStorage.getItem('customer_token');
            if (!token) {
                throw new Error("Autentikasi tidak ditemukan. Silakan login kembali.");
            }

            const response = await fetch('http://localhost:5001/api/pembatalan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    pesananId: order.id,
                    alasanPembatalan: reason,
                    tanggalPengajuan: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors || 'Gagal mengirim permintaan pembatalan.');
            }

            alert('Permintaan pembatalan berhasil dikirim.');
            onSuccess(); // Refresh list pesanan
            onClose(); // Tutup modal

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.popupOverlay} onClick={onClose}>
            <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.popupWrapper}>
                    <div className={styles.popupTitle}>
                        <h2>CANCEL REQUEST</h2>
                    </div>
                    <div className={styles.popupDatacus}>
                        {/* Menampilkan nama akun dan detail rekening secara terpisah */}
                        <div className={styles.popupDatacusTitle}>
                            <p>Customer Name</p>
                            <p>Bank Name</p>
                            <p>Account Holder's Name</p>
                            <p>Bank Account Number</p>
                        </div>
                        <div className={styles.popupDatacusContent}>
                            <p>{customerName}</p>
                            <p>{order.bankName}</p>
                            <p>{order.accountName}</p>
                            <p>{order.accountNumber}</p>
                        </div>
                    </div>
                    <div className={styles.popupReason}>
                        <p>Your Reason</p>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Type here ..."
                        />
                    </div>
                    {error && <p className={styles.errorText}>{error}</p>}
                    <div className={styles.popupButtonsYesno}>
                        <button
                            className={styles.yesBtn}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Request'}
                        </button>
                        <button className={styles.noBtn} onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

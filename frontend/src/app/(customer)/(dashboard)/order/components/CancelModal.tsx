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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function CancelModal({ isOpen, onClose, onSuccess, order }: CancelModalProps) {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [customerName, setCustomerName] = useState('');

    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info');

    const showCustomNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotificationMessage(message);
        setNotificationType(type);
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };

    useEffect(() => {
        if (isOpen) {
            const nama = localStorage.getItem('customer_nama');
            setCustomerName(nama || 'Nama tidak ditemukan');
            setReason('');
            setShowNotification(false);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!reason.trim()) {
            showCustomNotification('Alasan pembatalan wajib diisi.', 'info');
            return;
        }

        setIsSubmitting(true);
        setShowNotification(false);

        try {
            const token = localStorage.getItem('customer_token');
            if (!token) {
                throw new Error("Autentikasi tidak ditemukan. Silakan login kembali.");
            }

            const response = await fetch(`${API_BASE_URL}/pembatalan`, {
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

            showCustomNotification('Permintaan pembatalan berhasil dikirim.', 'success');
            onSuccess();
            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (err: any) {
            showCustomNotification(err.message, 'error');
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
                    {/* Error text moved to custom notification */}
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

            {/* Custom Notification Popup */}
            {showNotification && (
                <div className={`${styles.notificationPopup} ${styles[notificationType]}`}>
                    <p>{notificationMessage}</p>
                </div>
            )}
        </div>
    );
}
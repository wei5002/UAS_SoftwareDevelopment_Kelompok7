import React from 'react';
import styles from '../cart.module.css';

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
};

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Konfirmasi Hapus</h2>
        <p>Apakah Anda yakin ingin menghapus <strong>{itemName}</strong> dari keranjang?</p>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Batal
          </button>
          <button className={styles.deleteConfirmBtn} onClick={onConfirm}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
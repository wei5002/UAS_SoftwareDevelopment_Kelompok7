// cart/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/app/header';
import FooterHitam from '@/app/components/footerHitam';
import EditModal from './components/editModal';
import OrderModal from './components/orderModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import styles from './cart.module.css';

type CartItem = {
  id: string;
  userId: string;
  produkVarianId: string;
  jumlah: number;
  totalHarga: number;
  produkVarian: {
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
};

type Notification = {
  message: string;
  type: 'success' | 'error';
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedCartItemForOrder, setSelectedCartItemForOrder] = useState<CartItem | null>(null);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);

  const [notification, setNotification] = useState<Notification | null>(null);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('customer_token');
      if (!token) throw new Error('Anda harus login sebagai customer.');

      const response = await fetch(`${API_BASE_URL}/keranjang/my`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setCartItems(response.ok ? data.data : []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
      showNotification('Gagal memuat keranjang.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    const timer = setTimeout(() => {
      setNotification(null);
    }, 3000);
    return () => clearTimeout(timer);
  };

  const handleEdit = (item: CartItem) => {
    setSelectedCartItem(item);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedCartItem(null);
    fetchCart();
  };

  const handleOrder = (item: CartItem) => {
    setSelectedCartItemForOrder(item);
    setShowOrderModal(true);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setSelectedCartItemForOrder(null);
    fetchCart();
  };

  const handleDeleteClick = (item: CartItem) => {
    setItemToDelete({ id: item.id, name: item.produkVarian.produk.namaProduk });
    setShowDeleteConfirmModal(true);
  };

  const handleCloseDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    const { id: itemId } = itemToDelete;
    const token = localStorage.getItem('customer_token');
    if (!token) {
      showNotification('Anda harus login sebagai customer.', 'error');
      handleCloseDeleteConfirmModal();
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/keranjang/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const errorData = await response.json();
      if (response.ok) {
        showNotification('Item berhasil dihapus.', 'success');
        fetchCart();
      } else {
        showNotification(`Gagal menghapus item: ${errorData.message || 'Error tidak diketahui'}`, 'error');
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      showNotification('Terjadi kesalahan saat menghapus item.', 'error');
    } finally {
      handleCloseDeleteConfirmModal();
    }
  };

  return (
    <>
      <Head>
        <title>Keranjang Belanja</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      </Head>

      <div className={styles.pageWrapper}>
        <Header />

        {notification && (
          <div className={`${styles.notification} ${notification.type === 'success' ? styles.success : styles.error}`}>
            {notification.message}
          </div>
        )}

        <div className={styles.orderList}>
          {loading ? (
            <p className={styles.loadingText}>Memuat keranjang...</p>
          ) : cartItems.length === 0 ? (
            <p className={styles.loadingText}>Keranjang Anda kosong.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={styles.orderCard}>
                <div className={styles.orderCardImg}>
                  <img
                    src={item.produkVarian.produk.gambar || 'https://via.placeholder.com/200'}
                    alt={item.produkVarian.produk.namaProduk}
                  />
                </div>

                <div className={styles.orderCardContent}>
                  <div className={styles.orderCardDesc}>
                    <h3>{item.produkVarian.produk.namaProduk}</h3>
                    <div className={styles.orderCardSizeWrap}>
                      <div className={styles.orderCardSize}>
                        <p>
                          Size: {item.produkVarian.size || '-'} | Thickness: {item.produkVarian.thickness ?? '-'} mm | Hole:{' '}
                          {item.produkVarian.hole === 0 ? 'None' : item.produkVarian.hole !== undefined ? `${item.produkVarian.hole} mm` : '-'}
                        </p>
                      </div>
                    </div>
                    <p>Harga: Rp {item.totalHarga.toLocaleString('id-ID')}</p>
                    <br />
                    <p>Jumlah: <span className={styles.amountValue}>{item.jumlah}</span></p>
                  </div>

                  <div className={styles.buttonWrap}>
                    <button className={styles.orderBtn} onClick={() => handleOrder(item)}>Order</button>
                    <button className={styles.produk} onClick={() => handleEdit(item)}>Edit</button>
                    <button className={styles.deleteCartBtn} onClick={() => handleDeleteClick(item)}>
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <FooterHitam />

        {showEditModal && selectedCartItem && (
          <EditModal
            id={selectedCartItem.produkVarian.produk.id}
            cartItemId={selectedCartItem.id}
            onClose={handleCloseEditModal}
          />
        )}

        {showOrderModal && selectedCartItemForOrder && (
          <OrderModal
            isOpen={showOrderModal}
            onClose={handleCloseOrderModal}
            totalPrice={selectedCartItemForOrder.totalHarga}
            shippingFee={0}
            keranjangId={selectedCartItemForOrder.id}
            cartItem={selectedCartItemForOrder}
          />
        )}

        <DeleteConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleConfirmDelete}
          itemName={itemToDelete?.name || ''}
        />
      </div>
    </>
  );
}
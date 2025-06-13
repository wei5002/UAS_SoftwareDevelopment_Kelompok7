'use client';

import Link from 'next/link';
import styles from './navbarAdmin.module.css';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NavbarAdmin() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasNewOrders, setHasNewOrders] = useState(false);

  // Cek autentikasi admin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token_admin');
      if (!token) {
        router.replace('/admin/auth/login');
      }
    }
  }, [router]);

  // Simulasi ada notifikasi order baru
  useEffect(() => {
    setHasNewOrders(true);
  }, []);

  return (
    <nav className={styles.navbar}>
      <Link
        href="/admin/products"
        className={pathname.startsWith('/admin/products') ? styles.active : ''}
      >
        PRODUCTS
      </Link>

      <div className={styles.notifContainer}>
        <Link
          href="/admin/orders"
          className={pathname.startsWith('/admin/orders') ? styles.active : ''}
        >
          NEW ORDERS
        </Link>
        {hasNewOrders && <div className={styles.notifSymbol}>!</div>}
      </div>

      <Link
        href="/admin/ongoing"
        className={pathname.startsWith('/admin/ongoing') ? styles.active : ''}
      >
        ONGOING ORDERS
      </Link>

      <Link
        href="/admin/sales-report"
        className={pathname.startsWith('/admin/sales-report') ? styles.active : ''}
      >
        SALES REPORT
      </Link>
    </nav>
  );
}

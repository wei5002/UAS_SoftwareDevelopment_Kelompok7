'use client';

import Link from 'next/link';
import styles from './navbar.module.css';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <Link
        href="/produk"
        className={pathname.startsWith('/produk') ? styles.active : ''}
      >
        PRODUCTS
      </Link>

      <Link
        href="/cart"
        className={pathname.startsWith('/cart') ? styles.active : ''}
      >
        CART
      </Link>

      <div className={styles.notifNeworder}>
        <Link
          href="/order"
          className={pathname.startsWith('/order') ? styles.active : ''}
        >
          YOUR ORDERS
        </Link>
      </div>
    </nav>
  );
}

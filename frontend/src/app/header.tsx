'use client';

import styles from './header.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [namaUser, setNamaUser] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const showNavbar = ['/produk', '/cart', '/order'].some(path =>
    pathname.startsWith(path)
  );

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    const nama = localStorage.getItem('customer_nama');
    setIsLoggedIn(!!token);
    setNamaUser(token ? nama || '' : '');
    setIsMenuOpen(false); 
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setLogoutError(null);
    const token = localStorage.getItem('customer_token');
    const email = localStorage.getItem('customer_email') || localStorage.getItem('customer_nama');
    if (!token || !email) {
      localStorage.removeItem('customer_token');
      localStorage.removeItem('customer_nama');
      localStorage.removeItem('customer_email');
      setIsLoggedIn(false);
      setNamaUser('');
      setShowLogoutConfirm(false);
      router.push('/auth/login');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/pelanggan/logout`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const data = await response.json();
        setLogoutError(data?.message || 'Gagal logout. Silakan coba lagi.');
        return;
      }
      localStorage.removeItem('customer_token');
      localStorage.removeItem('customer_nama');
      localStorage.removeItem('customer_email');
      setIsLoggedIn(false);
      setNamaUser('');
      setShowLogoutConfirm(false);
      router.push('/auth/login');
    } catch (err) {
      setLogoutError('Terjadi masalah koneksi. Silakan coba lagi.');
    }
  };

  const isAuthPage =
    pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup');

  return (
    <>
      <div className={styles.fixedHeaderContainer}>
        <header className={styles.topHeader}>
          <div className={styles.headerContent}>
            <div className={styles.logoContainer}>
              <Image
                src="/assets/images/majumakmur.png"
                alt="Logo"
                width={200}
                height={80}
                className={styles.logo}
                onClick={() => router.push('/')}
                priority
              />
            </div>

            <div className={styles.tagline}>
              Your trusted supplier for High Quality Stainless Steel Materials
            </div>

            <div className={styles.actionsContainer} ref={menuRef}>
              <button
                className={styles.hamburgerBtn}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <div className={styles.hamburgerIcon}></div>
              </button>
              <div
                className={`${styles.navActions} ${
                  isMenuOpen ? styles.menuOpen : ''
                }`}
              >
                {pathname === '/' ? (
                  <>
                    <button onClick={() => router.push('/auth/login')} className={styles.loginBtn}>LOG IN</button>
                    <button onClick={() => router.push('/auth/signup')} className={styles.signupBtn}>SIGN UP</button>
                  </>
                ) : !isAuthPage && isLoggedIn ? (
                  <>
                    {/* --- PERUBAHAN DI SINI --- */}
                    <span className={styles.namaUser} onClick={() => router.push('/account')}>
                      {namaUser}
                    </span>
                    <button onClick={() => setShowLogoutConfirm(true)} className={styles.logoutBtn}>LOG OUT</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => router.push('/auth/login')} className={styles.loginBtn}>LOG IN</button>
                    <button onClick={() => router.push('/auth/signup')} className={styles.signupBtn}>SIGN UP</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {showNavbar && (
          <nav className={styles.secondaryNavbar}>
            <div className={styles.secondaryNavbarContent}>
              <Link href="/produk" className={pathname.startsWith('/produk') ? styles.active : ''}>PRODUCTS</Link>
              <Link href="/cart" className={pathname.startsWith('/cart') ? styles.active : ''}>CART</Link>
              <Link href="/order" className={pathname.startsWith('/order') ? styles.active : ''}>YOUR ORDERS</Link>
            </div>
          </nav>
        )}
      </div>

      <div className={showNavbar ? styles.contentSpacerWithNavbar : styles.contentSpacer} />

      {showLogoutConfirm && (
        <div className={styles.logoutOverlay} onClick={() => setShowLogoutConfirm(false)}>
          <div className={styles.logoutPopup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.logoutTitle}>Yakin ingin logout?</div>
            {logoutError && <div className={styles.logoutError}>{logoutError}</div>}
            <div className={styles.logoutAction}>
              <button className={styles.logoutConfirmBtn} onClick={handleLogout}>LOGOUT</button>
              <button className={styles.logoutCancelBtn} onClick={() => setShowLogoutConfirm(false)}>BATAL</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
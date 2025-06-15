'use client';

import styles from './headerAdmin.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function HeaderAdmin() {
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 900);
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token_admin');
      const role = localStorage.getItem('role_admin');
      const nama = localStorage.getItem('nama_admin');
      setIsSidebarOpen(false); 

      if (token && role === 'admin') {
        setIsAdminLoggedIn(true);
        setAdminName(nama || 'Admin');
        fetchNotifications(token);
      } else {
        setIsAdminLoggedIn(false);
        setAdminName('');
        setHasNewOrders(false); 
        if (!pathname.startsWith('/admin/auth')) {
          router.replace('/admin/auth/login');
        }
      }
    }
  }, [isMounted, pathname, router]);

  const fetchNotifications = async (token: string) => {
    try {
      const ordersRes = await fetch(`${API_BASE_URL}/pesanan`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();
      const pendingOrders = Array.isArray(ordersData.data)
        ? ordersData.data.filter((order: { status: string }) => order.status === 'PENDING') 
        : [];

      const cancellationsRes = await fetch(`${API_BASE_URL}/pembatalan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cancellationsData = await cancellationsRes.json();
      const pendingCancellations = Array.isArray(cancellationsData.data)
        ? cancellationsData.data.filter((req: { statusPembatalan: string }) => req.statusPembatalan === 'menunggu')
        : [];

      setHasNewOrders(pendingOrders.length > 0 || pendingCancellations.length > 0);

    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setHasNewOrders(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('bodyScrollLock', isSidebarOpen);
      return () => {
        document.body.classList.remove('bodyScrollLock');
      };
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen && isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSidebarOpen, isMobile]);

  const handleLogout = async () => {
    const token = (typeof window !== 'undefined') ? localStorage.getItem('token_admin') : '';
    try {
      await fetch(`${API_BASE_URL}/admin/logout`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token || '',
        },
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token_admin');
        localStorage.removeItem('nama_admin');
        localStorage.removeItem('role_admin');
      }
      setIsAdminLoggedIn(false);
      setAdminName('');
      setHasNewOrders(false); 
      router.replace('/admin/auth/login');
    }
  };

  const handleAdminNameClick = () => { 
    router.push('/admin/account');
  };

  if (!isMounted) return null;

  const showAdminMenu = isAdminLoggedIn && !pathname.startsWith('/admin/auth');

  const sidebarContent = (
    <div className={styles.sidebarContent}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarTitle}>Menu Admin</span>
        <button
          className={styles.sidebarCloseBtn}
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Tutup menu"
        >×</button>
      </div>
      <div className={styles.sidebarSection}>
        {isAdminLoggedIn && (
          <>
            <span className={styles.namaUser} onClick={handleAdminNameClick}>{adminName}</span> {/* NEW: onClick */}
            <button onClick={handleLogout} className={styles.logoutBtn}>LOG OUT</button>
          </>
        )}
        {!isAdminLoggedIn && pathname === '/admin/auth/login' && (
          <Link href="/admin/auth/signup" className={styles.signupBtn}>SIGN UP</Link>
        )}
        {!isAdminLoggedIn && pathname === '/admin/auth/signup' && (
          <Link href="/admin/auth/login" className={styles.loginBtn}>LOG IN</Link>
        )}
      </div>
      {showAdminMenu && (
        <div className={styles.sidebarLinks}>
          <Link
            href="/admin/products"
            className={pathname.startsWith('/admin/products') ? styles.active : ''}
            onClick={() => setIsSidebarOpen(false)}
          >PRODUCTS</Link>
          <div className={styles.notifContainer}>
            <Link
              href="/admin/orders"
              className={pathname.startsWith('/admin/orders') ? styles.active : ''}
              onClick={() => setIsSidebarOpen(false)}
            >NEW ORDERS</Link>
            {hasNewOrders && <div className={styles.notifSymbol}>!</div>}
          </div>
          <Link
            href="/admin/ongoing"
            className={pathname.startsWith('/admin/ongoing') ? styles.active : ''}
            onClick={() => setIsSidebarOpen(false)}
          >ONGOING ORDERS</Link>
          <Link
            href="/admin/sales-report"
            className={pathname.startsWith('/admin/sales-report') ? styles.active : ''}
            onClick={() => setIsSidebarOpen(false)}
          >SALES REPORT</Link>
        </div>
      )}
    </div>
  );

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
                onClick={() => router.push(isAdminLoggedIn ? '/admin/products' : '/')}
                priority
              />
            </div>
            <div className={styles.tagline}>
              Your trusted supplier for High Quality Stainless Steel Materials
            </div>
            {!isMobile && (
              <div className={styles.actionsContainer}>
                {isAdminLoggedIn && (
                  <>
                    <span className={styles.namaUser} onClick={handleAdminNameClick}>{adminName}</span> {/* NEW: onClick */}
                    <button onClick={handleLogout} className={styles.logoutBtn}>LOG OUT</button>
                  </>
                )}
                {!isAdminLoggedIn && pathname === '/admin/auth/login' && (
                  <Link href="/admin/auth/signup" className={styles.signupBtn}>SIGN UP</Link>
                )}
                {!isAdminLoggedIn && pathname === '/admin/auth/signup' && (
                  <Link href="/admin/auth/login" className={styles.loginBtn}>LOG IN</Link>
                )}
              </div>
            )}
            {isMobile && (
              <button
                className={styles.hamburgerBtn}
                aria-label="Open menu"
                onClick={() => setIsSidebarOpen(true)}
              >
                <span className={styles.hamburgerIcon}>
                  <span />
                  <span />
                  <span />
                </span>
                <span className={styles.hamburgerText}>Menu</span>
              </button>
            )}
          </div>
        </header>

        {isMobile && (
          <>
            <nav
              ref={sidebarRef}
              className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
              aria-label="Menu admin"
            >
              {sidebarContent}
            </nav>
            {isSidebarOpen && (
              <div className={styles.sidebarOverlay} onClick={() => setIsSidebarOpen(false)} />
            )}
          </>
        )}

        {!isMobile && showAdminMenu && (
          <div className={styles.secondaryNavWrapper}>
            <nav className={styles.secondaryNavbar}>
              <div className={styles.secondaryNavbarContent}>
                <Link
                  href="/admin/products"
                  className={pathname.startsWith('/admin/products') ? styles.active : ''}
                >PRODUCTS</Link>
                <div className={styles.notifContainer}>
                  <Link
                    href="/admin/orders"
                    className={pathname.startsWith('/admin/orders') ? styles.active : ''}
                  >NEW ORDERS</Link>
                  {hasNewOrders && <div className={styles.notifSymbol}>!</div>}
                </div>
                <Link
                  href="/admin/ongoing"
                  className={pathname.startsWith('/admin/ongoing') ? styles.active : ''}
                >ONGOING ORDERS</Link>
                <Link
                  href="/admin/sales-report"
                  className={pathname.startsWith('/admin/sales-report') ? styles.active : ''}
                >SALES REPORT</Link>
              </div>
            </nav>
          </div>
        )}
      </div>
      {showAdminMenu ? (
        <div className={styles.contentSpacerWithNavbar} />
      ) : (
        <div className={styles.contentSpacer} />
      )}
    </>
  );
}
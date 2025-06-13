'use client';

import styles from './header.module.css';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [namaUser, setNamaUser] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // Gunakan key khusus customer di localStorage
    const token = localStorage.getItem('customer_token');
    const nama = localStorage.getItem('customer_nama');

    if (token) {
      setIsLoggedIn(true);
      setNamaUser(nama || '');
    } else {
      setIsLoggedIn(false);
      setNamaUser('');
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_nama');
    setIsLoggedIn(false);
    setNamaUser('');
    setShowLogoutConfirm(false);
    router.push('/auth/login');
  };

  const isAuthPage = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup');

  return (
    <header className={styles.navbar}>
      <div className={styles.headerContent}>
        {/* Logo */}
        <div>
          <Image
            src="/assets/images/majumakmur.png"
            alt="Logo"
            width={200}
            height={80}
            className={styles.logo}
          />
        </div>

        {/* Tagline */}
        <div className={styles.tagline}>
          Your trusted supplier for High Quality Stainless Steel Materials
        </div>

        {/* Login / Signup or Logout + Nama */}
        <div className={styles.loginSignupBtn}>
          {pathname === '/' ? (
            <>
              <button
                onClick={() => router.push('/auth/login')}
                className={styles.loginBtn}
              >
                LOG IN
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className={styles.signupBtn}
              >
                SIGN UP
              </button>
            </>
          ) : !isAuthPage && isLoggedIn ? (
            <>
              <span className={styles.namaUser}>{namaUser}</span>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className={styles.logoutBtn}
              >
                LOG OUT
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push('/auth/login')}
                className={styles.loginBtn}
              >
                LOG IN
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className={styles.signupBtn}
              >
                SIGN UP
              </button>
            </>
          )}
        </div>
      </div>

      {/* POPUP LOGOUT CONFIRM */}
      {showLogoutConfirm && (
        <div
          style={{
            position: 'fixed',
            zIndex: 99999,
            top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            style={{
              background: '#fff',
              padding: 36,
              borderRadius: 16,
              boxShadow: '0 8px 32px #0003',
              minWidth: 320,
              color: '#20222e',
              textAlign: 'center',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>
              Yakin ingin logout?
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
              <button
                style={{
                  background: '#e57373',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 28px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 17,
                }}
                onClick={handleLogout}
              >
                LOGOUT
              </button>
              <button
                style={{
                  background: '#eee',
                  color: '#444',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 24px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 17,
                }}
                onClick={() => setShowLogoutConfirm(false)}
              >
                BATAL
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

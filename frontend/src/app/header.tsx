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

  useEffect(() => {
    // Cek apakah ada token di localStorage
    const token = localStorage.getItem('token');
    const nama = localStorage.getItem('nama');

    if (token) {
      setIsLoggedIn(true);
      setNamaUser(nama || '');
    } else {
      setIsLoggedIn(false);
      setNamaUser('');
    }
  }, [pathname]); 

  const handleLogout = () => {
    // Hapus token & nama dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('nama');
    setIsLoggedIn(false);
    setNamaUser('');
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
          {/* Jika di path "/" → selalu tampil Login & Sign Up */}
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
          ) : !isAuthPage && isLoggedIn ? ( // tambahkan kondisi disini
            <>
              <span className={styles.namaUser}>{namaUser}</span>
              <button
                onClick={handleLogout}
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
    </header>
  );
}

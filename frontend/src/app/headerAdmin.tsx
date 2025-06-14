'use client';

import styles from './headerAdmin.module.css';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function HeaderAdmin() {
  const router = useRouter();
  const pathname = usePathname();

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token_admin');
    const role = localStorage.getItem('role_admin');
    const nama = localStorage.getItem('nama_admin');

    if (token && role === 'admin') {
      setIsAdminLoggedIn(true);
      setAdminName(nama || 'Admin');
    } else {
      setIsAdminLoggedIn(false);
      setAdminName('');
      if (!pathname.startsWith('/admin/auth')) {
        router.replace('/admin/auth/login');
      }
    }
    
  }, [pathname]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token_admin');
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
      localStorage.removeItem('token_admin');
      localStorage.removeItem('nama_admin');
      localStorage.removeItem('role_admin');
      setIsAdminLoggedIn(false);
      setAdminName('');
      router.replace('/admin/auth/login');
    }
  };

  const renderAuthSection = () => {
    if (pathname === '/admin/auth/login') {
      return (
        <button onClick={() => router.push('/admin/auth/signup')} className={styles.signupBtn}>
          SIGN UP
        </button>
      );
    }

    if (pathname === '/admin/auth/signup') {
      return (
        <button onClick={() => router.push('/admin/auth/login')} className={styles.loginBtn}>
          LOG IN
        </button>
      );
    }

    if (isAdminLoggedIn) {
      return (
        <>
          <span className={styles.namaUser}>{adminName}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            LOG OUT
          </button>
        </>
      );
    }

    return null;
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.headerContent}>
        <div>
          <Image
            src="/assets/images/majumakmur.png"
            alt="Logo"
            width={200}
            height={80}
            className={styles.logo}
            onClick={() => router.push(isAdminLoggedIn ? '/admin/products' : '/')}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div className={styles.tagline}>
          Your trusted supplier for High Quality Stainless Steel Materials
        </div>

        <div className={styles.loginSignupBtn}>
          {renderAuthSection()}
        </div>
      </div>
    </header>
  );
}

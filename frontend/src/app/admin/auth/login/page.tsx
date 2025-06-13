'use client';

import styles from './login.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import HeaderAdmin from '@/app/headerAdmin';
import Footer from '@/app/footer';

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.errors || result.message || 'Login gagal. Periksa kembali username dan password.');
      }

      if (result.data && result.data.token && result.data.username) {
        // SIMPAN DENGAN KEY KHUSUS ADMIN
        localStorage.setItem('token_admin', result.data.token);
        localStorage.setItem('nama_admin', result.data.username);
        localStorage.setItem('role_admin', 'admin');

        // Arahkan ke dashboard admin
        router.push('/admin/products');
      } else {
        throw new Error('Format respons dari server tidak valid.');
      }

    } catch (err: any) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HeaderAdmin />
      <main className={styles.main}>
        <div className={styles.kotak_login}>
          <h1 className={styles.title}>ADMIN LOG IN</h1>
          <form onSubmit={handleLogin} className={styles.form}>
            {error && (
              <p className={styles.errorMessage}>{error}</p>
            )}

            <div className={styles.baris_form}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Masukkan Username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.baris_form}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Masukkan Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.btn_group}>
              <button
                type="submit"
                className={styles.btn_next}
                disabled={isLoading}
              >
                {isLoading ? 'MEMPROSES...' : 'LOG IN'}
              </button>
            </div>
            <div className={styles.signupLink}>
              Belum punya akun admin? <Link href="/admin/auth/signup">Daftar di sini</Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

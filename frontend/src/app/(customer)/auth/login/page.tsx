'use client';

import styles from './login.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/header';
import Footer from '@/app/footer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); 

    try {
      const response = await fetch(`${API_BASE_URL}/pelanggan/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || result.errors || 'Login gagal. Periksa kembali email dan password Anda.';
        throw new Error(errorMessage);
      }

      localStorage.setItem('customer_token', result.data.token);
      localStorage.setItem('customer_nama', result.data.nama);
      localStorage.setItem('customer_email', result.data.email);

      router.push('/produk');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>LOG IN</h1>
        <div className={styles.kotak_login}>
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.baris_form}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Masukkan Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.baris_form}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Masukkan Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Notifikasi menggunakan kelas CSS */}
            {error && (
              <p className={styles.error}>{error}</p>
            )}

            <div className={styles.btn_group}>
              <button
                type="button"
                className={styles.btn_back}
                onClick={() => router.push('/')}
                disabled={isLoading}
              >
                BACK
              </button>
              <button
                type="submit"
                className={styles.btn_next}
                disabled={isLoading}
              >
                {isLoading ? 'Logging In...' : 'NEXT'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

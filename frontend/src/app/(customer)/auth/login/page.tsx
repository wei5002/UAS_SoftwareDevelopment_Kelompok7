'use client';

import styles from './login.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/header';
import Footer from '@/app/footer';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/api/pelanggan/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.errors || result.message || 'Login gagal');
      }

      // Simpan token, nama, email ke localStorage
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('nama', result.data.nama);
      localStorage.setItem('email', result.data.email);

      // Redirect ke halaman Home (atau halaman setelah login)
      router.push('/produk');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
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

            {error && (
              <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
            )}

            <div className={styles.btn_group}>
              <button
                type="button"
                className={styles.btn_back}
                onClick={() => router.push('/')}
              >
                BACK
              </button>
              <button
                type="submit"
                className={styles.btn_next}
              >
                NEXT
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

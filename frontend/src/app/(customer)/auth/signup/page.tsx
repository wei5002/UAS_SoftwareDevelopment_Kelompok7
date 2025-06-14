'use client';

import styles from './signup.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/header';
import Footer from '@/app/footer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function SignupPage() {
  const router = useRouter();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi password & confirm
    if (password !== confirmPassword) {
      setError('Password dan Confirm Password harus sama');
      setSuccess('');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/pelanggan/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.errors || result.message || 'Signup gagal');
      }

      setSuccess(result.message);
      setError('');

      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);

    } catch (err: any) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'rgb(255, 255, 255)',
      backgroundSize: 'cover',
      color: 'black',
      backgroundImage: "url('/assets/images/barang stainless steel.png')",
    }}>
      <Navbar />

      <main className={styles.main}>
        <h1 className={styles.h1}>SIGN UP</h1>
        <div className={styles.kotak_signup}>
          <form onSubmit={handleSignup} className={styles.form}>
            <div className={styles.baris_form}>
              <label className={styles.label}>Nama</label>
              <input
                type="text"
                placeholder="Masukkan Nama..."
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.baris_form}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                placeholder="Masukkan Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.baris_form}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Masukkan Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.baris_form}>
              <label className={styles.label}>Confirm Password</label>
              <input
                type="password"
                placeholder="Masukkan Confirm Password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}

            <div className={styles.btn_group}>
              <button
                type="button"
                className={styles.btn_back}
                onClick={() => router.push('/auth/login')}
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
    </div>
  );
}

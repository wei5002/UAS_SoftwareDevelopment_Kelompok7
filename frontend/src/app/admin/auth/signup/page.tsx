'use client';

import styles from './signup.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderAdmin from '@/app/headerAdmin';
import Footer from '@/app/footer';

export default function AdminSignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.errors || result.message || 'Pendaftaran admin gagal.');
      }

      setSuccess('Admin baru berhasil didaftarkan! Anda akan diarahkan ke halaman login.');
      setTimeout(() => {
        router.push('/admin/auth/login');
      }, 1800); // redirect lebih cepat (opsional)

    } catch (err: any) {
      setError(err.message);
      console.error('Admin signup error:', err);
    }
  };

  return (
    <>
      <HeaderAdmin />
      <main className={styles.main}>
        <h1 className={styles.title}>REGISTER ADMIN</h1>
        <div className={styles.kotak_signup}>
          <form onSubmit={handleAdminSignup} className={styles.form}>
            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}

            <div className={styles.baris_form}>
              <label htmlFor="username">Username</label>
              <input 
                id="username" 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className={styles.baris_form}>
              <label htmlFor="password">Password</label>
              <input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div className={styles.baris_form}>
              <label htmlFor="confirmPassword">Konfirmasi Password</label>
              <input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>

            <div className={styles.btn_group}>
              <button
                type="button"
                className={styles.btn_back}
                onClick={() => router.push('/admin/auth/login')}
              >
                KEMBALI KE LOGIN
              </button>
              <button
                type="submit"
                className={styles.btn_next}
              >
                DAFTAR ADMIN
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

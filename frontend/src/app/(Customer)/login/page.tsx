'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/navbar';
import Footer from '@/app/footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('http://localhost:5001/api/pelanggan/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login gagal');
      }

      // Simpan token ke localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('nama', data.nama);
      localStorage.setItem('email', data.email);

      setMessage('Login berhasil!');
      setIsError(false);
      setTimeout(() => {
        router.push('/produk');
      }, 1500);
    } catch (error: any) {
      setMessage(error.message || 'Terjadi kesalahan saat login');
      setIsError(true);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <h1>LOG IN</h1>
        <div className="kotak_login">
          <form onSubmit={handleLogin}>
            <div className="baris_form">
              <label>Email</label>
              <input
                type="email"
                placeholder="Masukkan Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="baris_form">
              <label>Password</label>
              <input
                type="password"
                placeholder="Masukkan Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {(message) && (
              <div className="form-message">
                <p className={isError ? 'error-msg' : 'success-msg'}>{message}</p>
              </div>
            )}

            <div className="btn-group">
              <button type="button" className="btn-back" onClick={() => router.push('/')}>
                BACK
              </button>
              <button type="submit" className="btn-next">
                LOGIN
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

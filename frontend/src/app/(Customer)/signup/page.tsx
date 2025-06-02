'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/navbar';
import Footer from '@/app/footer';

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    const { nama, email, password } = form;

    if (!nama.trim()) return "nama wajib diisi";
    if (typeof nama !== "string") return "nama harus berupa string";
    if (nama.length > 100) return "nama maksimal 100 karakter";

    if (!email.trim()) return "email wajib diisi";
    if (typeof email !== "string") return "email harus berupa string";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "email harus dalam format yang valid";

    if (!password.trim()) return "password wajib diisi";
    if (typeof password !== "string") return "password harus berupa string";
    if (password.length < 8) return "password minimal 8 karakter";
    if (password.length > 100) return "password maksimal 100 karakter";
    const allowed = /^[a-zA-Z0-9!@#$%^&*()_+={}|<>?;:,.~]*$/;
    if (!allowed.test(password)) return "password hanya boleh mengandung huruf, angka, dan karakter khusus";

    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/pelanggan/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Email telah digunakan") {
          setError("Email telah digunakan");
        } else {
          setError(data.message || "Pendaftaran gagal");
        }
        return;
      }

      setSuccess("Pendaftaran berhasil!");
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err) {
      setError("Terjadi kesalahan saat menghubungi server");
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <h1>SIGN UP</h1>
        <div className="kotak_login">
          <form onSubmit={handleSubmit}>
            <div className="baris_form">
              <label htmlFor="nama">Name</label>
              <input
                type="text"
                id="nama"
                name="nama"
                placeholder="Masukkan name..."
                value={form.nama}
                onChange={handleChange}
                required
              />
            </div>

            <div className="baris_form">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Masukkan email..."
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="baris_form">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Masukkan Password..."
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {(error || success) && (
              <div className="form-message">
                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success}</p>}
              </div>
            )}

            <div className="btn-group">
              <button type="button" className="btn-back" onClick={() => router.push('/')}>
                BACK
              </button>
              <button type="submit" className="btn-next">
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

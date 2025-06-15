'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './account.module.css';
import Header from '@/app/header';
import Footer from '@/app/footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function AccountPage() {
  const router = useRouter();

  const [profileData, setProfileData] = useState({ nama: '', email: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSuccessDeletePopup, setShowSuccessDeletePopup] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/pelanggan/current`, {
          headers: {
            'Authorization': token,
          },
        });
        if (!response.ok) {
          throw new Error('Gagal mengambil data pengguna. Silakan login kembali.');
        }
        const result = await response.json();
        setProfileData(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsProfileUpdating(true);
    const token = localStorage.getItem('customer_token');

    try {
      const response = await fetch(`${API_URL}/pelanggan/current`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token!,
        },
        body: JSON.stringify({
          nama: profileData.nama,
          email: profileData.email,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.errors || 'Gagal memperbarui profil.');
      }

      localStorage.setItem('customer_nama', result.data.nama);
      localStorage.setItem('customer_email', result.data.email);

      setSuccess('Profil berhasil diperbarui!');
      scrollToTop();
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      setError(err.message);
      scrollToTop();
    } finally {
      setIsProfileUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError('Password baru dan konfirmasi tidak cocok.');
      scrollToTop();
      return;
    }

    setIsPasswordUpdating(true);
    const token = localStorage.getItem('customer_token');

    try {
      const response = await fetch(`${API_URL}/pelanggan/current/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token!,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        const errorMessage = result.errors || 'Gagal mengubah password.';
        throw new Error(errorMessage);
      }
      setSuccess('Password berhasil diubah!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPasswordUpdating(false);
      scrollToTop();
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsDeleting(true);
    const token = localStorage.getItem('customer_token');

    try {
      const response = await fetch(`${API_URL}/pelanggan/current`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token!,
        },
        body: JSON.stringify({ password: deleteConfirmPassword }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.errors || 'Gagal menghapus akun. Password mungkin salah.');
      }

      setShowDeletePopup(false);
      localStorage.clear();
      setShowSuccessDeletePopup(true);

    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccessDeleteRedirect = () => {
    setShowSuccessDeletePopup(false);
    router.push('/auth/login');
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loading}>Loading...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Account Settings</h1>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <div className={styles.card}>
          <h2>Ubah Profil</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className={styles.formGroup}>
              <label htmlFor="nama">Nama</label>
              <input type="text" id="nama" name="nama" value={profileData.nama} onChange={handleProfileChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={profileData.email} onChange={handleProfileChange} required />
            </div>
            <button type="submit" className={styles.button} disabled={isProfileUpdating}>
              {isProfileUpdating ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
            </button>
          </form>
        </div>

        <div className={styles.card}>
          <h2>Ubah Password</h2>
          <form onSubmit={handleUpdatePassword}>
            <div className={styles.formGroup}>
              <label htmlFor="oldPassword">Password Lama</label>
              <input type="password" id="oldPassword" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">Password Baru</label>
              <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmNewPassword">Konfirmasi Password Baru</label>
              <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required />
            </div>
            <button type="submit" className={styles.button} disabled={isPasswordUpdating}>
              {isPasswordUpdating ? 'Memperbarui...' : 'Ubah Password'}
            </button>
          </form>
        </div>

        <div className={`${styles.card} ${styles.dangerZone}`}>
          <h2>Hapus Akun</h2>
          <p>Tindakan ini tidak dapat diurungkan. Semua data Anda akan dihapus secara permanen.</p>
          <button
            type="button"
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={() => setShowDeletePopup(true)}
          >
            Hapus Akun Saya
          </button>
        </div>
        <button className={`${styles.button} ${styles.backButtonBottom}`} onClick={handleBack}>
          &larr; Back
        </button>
      </div>

      {showDeletePopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <h2 className={styles.popupTitle}>Konfirmasi Hapus Akun</h2>
            <p className={styles.popupText}>
              Anda yakin ingin menghapus akun Anda secara permanen? Masukkan password Anda untuk melanjutkan.
            </p>
            <form onSubmit={handleDeleteAccount}>
              <div className={styles.formGroup}>
                <label htmlFor="deleteConfirmPasswordPopup">Password</label>
                <input
                  type="password"
                  id="deleteConfirmPasswordPopup"
                  value={deleteConfirmPassword}
                  onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className={styles.popupActions}>
                <button
                  type="button"
                  className={styles.popupCancelBtn}
                  onClick={() => setShowDeletePopup(false)}
                  disabled={isDeleting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={styles.popupConfirmBtn}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Menghapus...' : 'Hapus Akun Permanen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP SUKSES HAPUS AKUN */}
      {showSuccessDeletePopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <h2 className={styles.popupTitleSuccess}>Akun Dihapus</h2>
            <p className={styles.popupText}>
              Akun Anda telah berhasil dihapus secara permanen. Anda akan dialihkan ke halaman login.
            </p>
            <div className={styles.popupActions}>
              <button
                type="button"
                className={styles.popupSuccessBtn}
                onClick={handleSuccessDeleteRedirect}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './account.module.css';
import HeaderAdmin from '@/app/headerAdmin';
import FooterHitam from '@/app/components/footerHitam';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||'http://localhost:5001/api';

export default function AdminAccountPage() {
  const router = useRouter();

  const [profileData, setProfileData] = useState({ username: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState('');
  const [statusPopupType, setStatusPopupType] = useState<'success' | 'error' | 'info'>('info');

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSuccessDeletePopup, setShowSuccessDeletePopup] = useState(false);


  const showStatusMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setStatusPopupMessage(message);
    setStatusPopupType(type);
    setShowStatusPopup(true);
    setTimeout(() => {
      setShowStatusPopup(false);
    }, 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const token = localStorage.getItem('token_admin');
    const role = localStorage.getItem('role_admin');

    if (!token || role !== 'admin') {
      router.push('/admin/auth/login');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/current`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.errors || 'Gagal mengambil data admin. Silakan login kembali.');
        }
        const result = await response.json();
        setProfileData({ username: result.data.username });
      } catch (err: any) {
        showStatusMessage(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [router]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    showStatusMessage('', 'info'); 
    setIsProfileUpdating(true);
    const token = localStorage.getItem('token_admin');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/current`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token!}`,
        },
        body: JSON.stringify({
          username: profileData.username,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.errors || 'Gagal memperbarui profil admin.');
      }

      localStorage.setItem('nama_admin', result.data.username);
      showStatusMessage('Profil admin berhasil diperbarui!', 'success');
      scrollToTop();

      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      showStatusMessage(err.message, 'error');
      scrollToTop();
    } finally {
      setIsProfileUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    showStatusMessage('', 'info'); 

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showStatusMessage('Password baru dan konfirmasi tidak cocok.', 'info');
      scrollToTop();
      return;
    }

    setIsPasswordUpdating(true);
    const token = localStorage.getItem('token_admin');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/current/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token!}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        const errorMessage = result.errors || 'Gagal mengubah password admin.';
        throw new Error(errorMessage);
      }
      showStatusMessage('Password admin berhasil diubah!', 'success');
      setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err: any) {
      showStatusMessage(err.message, 'error');
    } finally {
      setIsPasswordUpdating(false);
      scrollToTop();
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    showStatusMessage('', 'info'); 
    setIsDeleting(true);
    const token = localStorage.getItem('token_admin');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/current`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token!}`,
        },
        body: JSON.stringify({ password: deleteConfirmPassword }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.errors || 'Gagal menghapus akun admin. Password mungkin salah.');
      }

      setShowDeletePopup(false);
      localStorage.clear();
      setShowSuccessDeletePopup(true); 
    } catch (err: any) {
      showStatusMessage(err.message, 'error'); 
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccessDeleteRedirect = () => {
    setShowSuccessDeletePopup(false);
    router.push('/admin/auth/login');
  }

  if (loading) {
    return (
      <>
        <HeaderAdmin />
        <div className={styles.loading}>Loading...</div>
        <FooterHitam />
      </>
    );
  }

  return (
    <>
      <HeaderAdmin />
      <div className={styles.container}>
        <h1 className={styles.title}>Admin Account Settings</h1>

        {/* Notifikasi akan ditampilkan oleh Custom Status Popup di bawah */}

        <div className={styles.card}>
          <h2>Ubah Profil Admin</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" value={profileData.username} onChange={handleProfileChange} required />
            </div>
            <button type="submit" className={styles.button} disabled={isProfileUpdating}>
              {isProfileUpdating ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
            </button>
          </form>
        </div>

        <div className={styles.card}>
          <h2>Ubah Password Admin</h2>
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
          <h2>Hapus Akun Admin</h2>
          <p>Tindakan ini tidak dapat diurungkan. Semua data akun admin akan dihapus secara permanen.</p>
          <button
            type="button"
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={() => setShowDeletePopup(true)}
          >
            Hapus Akun Admin Saya
          </button>
        </div>
        <button className={`${styles.button} ${styles.backButtonBottom}`} onClick={handleBack}>
          &larr; Back
        </button>
      </div>

      {showDeletePopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <h2 className={styles.popupTitle}>Konfirmasi Hapus Akun Admin</h2>
            <p className={styles.popupText}>
              Anda yakin ingin menghapus akun admin Anda secara permanen? Masukkan password Anda untuk melanjutkan.
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

      {/* --- POPUP SUKSES HAPUS AKUN --- */}
      {showSuccessDeletePopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <h2 className={styles.popupTitleSuccess}>Akun Admin Dihapus</h2>
            <p className={styles.popupText}>
              Akun admin Anda telah berhasil dihapus secara permanen. Anda akan dialihkan ke halaman login admin.
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

      {/* Custom Status Popup (Added here) */}
      {showStatusPopup && (
        <div className={styles['status-popup-overlay']}> {/* Use the class defined in orders.module.css for general status popups */}
          <div className={`${styles['status-popup-content']} ${styles[statusPopupType]}`}>
            <p>{statusPopupMessage}</p>
            <button onClick={() => setShowStatusPopup(false)} className={styles['status-popup-close']}>&times;</button>
          </div>
        </div>
      )}

      <FooterHitam />
    </>
  );
}
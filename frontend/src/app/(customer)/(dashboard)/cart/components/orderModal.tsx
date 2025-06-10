'use client';

import { useState, useEffect } from 'react';
import styles from './orderModal.module.css';

// Type definitions for clarity and self-containment
type CartItem = {
  id: string;
  userId: string;
  produkVarianId: string;
  jumlah: number;
  totalHarga: number;
  produkVarian: {
    id: string;
    produkId: string;
    size?: string;
    thickness?: number;
    hole?: number;
    harga: number;
    stok: number;
    produk: {
      id: string;
      namaProduk: string;
      kategori: string;
      gambar?: string;
    };
  };
};

type OrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  shippingFee: number;
  keranjangId: string;
  cartItem: CartItem; // Prop to receive cart item details
};

type Wilayah = {
  id: string;
  name: string;
};

const PULAU_JAWA_PROVINCES = [
  'Banten',
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur'
];

export default function OrderModal({ isOpen, onClose, totalPrice, shippingFee: initialShippingFee, keranjangId, cartItem }: OrderModalProps) {
  const [form, setForm] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    nomorTelepon: '',
    provinsi: '',
    kabupaten: '',
    kecamatan: '',
    kelurahan: '',
    alamatDetail: '',
    buktiTransferFile: null as File | null,
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [shippingFee, setShippingFee] = useState(initialShippingFee);

  const [provinces, setProvinces] = useState<Wilayah[]>([]);
  const [regencies, setRegencies] = useState<Wilayah[]>([]);
  const [districts, setDistricts] = useState<Wilayah[]>([]);
  const [villages, setVillages] = useState<Wilayah[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState('');
  const [selectedRegencyId, setSelectedRegencyId] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [selectedVillageId, setSelectedVillageId] = useState('');

  const fetchProvinces = async () => {
    const res = await fetch('http://localhost:5001/proxy/provinces');
    const data = await res.json();
    setProvinces(data);
  };

  const fetchRegencies = async (provinceId: string) => {
    const res = await fetch(`http://localhost:5001/proxy/regencies/${provinceId}`);
    const data = await res.json();
    setRegencies(data);
  };

  const fetchDistricts = async (regencyId: string) => {
    const res = await fetch(`http://localhost:5001/proxy/districts/${regencyId}`);
    const data = await res.json();
    setDistricts(data);
  };

  const fetchVillages = async (districtId: string) => {
    const res = await fetch(`http://localhost:5001/proxy/villages/${districtId}`);
    const data = await res.json();
    setVillages(data);
  };

  useEffect(() => {
    if (isOpen) {
      fetchProvinces();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, buktiTransferFile: file }));
  };

  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvinceId(provinceId);

    const selectedProvince = provinces.find((p) => p.id === provinceId);
    const provinceName = selectedProvince?.name || '';

    setForm((prev) => ({ ...prev, provinsi: provinceName }));

    setSelectedRegencyId('');
    setSelectedDistrictId('');
    setSelectedVillageId('');
    setRegencies([]);
    setDistricts([]);
    setVillages([]);

    fetchRegencies(provinceId);

    const isPulauJawa = PULAU_JAWA_PROVINCES.some((jawaProv) =>
      provinceName.toLowerCase().includes(jawaProv.toLowerCase())
    );

    if (isPulauJawa) {
      setShippingFee(0);
    } else {
      setShippingFee(100000);
    }
  };

  const handleSubmit = async () => {
    if (!form.buktiTransferFile) {
      setError('Mohon upload bukti transfer terlebih dahulu.');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const uploadFormData = new FormData();
      uploadFormData.append('gambar', form.buktiTransferFile);
      uploadFormData.append('nama', 'buktitransfer');

      const uploadRes = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadRes.ok) {
        throw new Error('Gagal upload ke server');
      }

      const uploadData = await uploadRes.json();
      const buktiTransferUrl = uploadData.data.gambar;

      const token = localStorage.getItem('token');

      const pesananRes = await fetch('http://localhost:5001/api/pesanan', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'PENDING',
          alamatDetail: form.alamatDetail,
          provinsi: form.provinsi,
          kabupaten: form.kabupaten,
          kecamatan: form.kecamatan,
          kelurahan: form.kelurahan,
          nomorTelepon: form.nomorTelepon,
          keranjangId: keranjangId,
          bankName: form.bankName,
          accountName: form.accountName,
          accountNumber: Number(form.accountNumber),
          buktiTransferUrl: buktiTransferUrl,
        }),
      });

      // MODIFICATION: Add detailed error logging
      if (!pesananRes.ok) {
        const errorBody = await pesananRes.json();
        console.error("Server error response:", errorBody);
        const errorMessage = errorBody.errors || errorBody.message || 'Gagal mengirim pesanan';
        throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
      }

      alert('Pesanan berhasil dikirim!');

      // --- STOCK UPDATE LOGIC ---
      try {
        const produkToUpdateInfo = cartItem.produkVarian.produk;
        const varianToUpdateId = cartItem.produkVarian.id;
        const orderedQuantity = cartItem.jumlah;

        const produkRes = await fetch(`http://localhost:5001/api/produk/${produkToUpdateInfo.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!produkRes.ok) throw new Error('Gagal mengambil data produk untuk update stok.');
        
        const produkData = await produkRes.json();
        const fullProduct = produkData.data;

        const updatedVarianArray = fullProduct.varian.map((v: any) => {
            if (v.id === varianToUpdateId) {
                return { ...v, stok: v.stok - orderedQuantity };
            }
            return v;
        });

        const updatePayload = {
            namaProduk: fullProduct.namaProduk,
            kategori: fullProduct.kategori,
            gambar: fullProduct.gambar,
            varian: updatedVarianArray,
        };

        const updateStockRes = await fetch(`http://localhost:5001/api/produk/${fullProduct.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatePayload),
        });

        if (!updateStockRes.ok) {
            const errorBody = await updateStockRes.json();
            console.error('Order created, but failed to update stock.', errorBody);
            alert('Pesanan dibuat, tetapi gagal memperbarui stok. Hubungi admin.');
        }

      } catch (stockUpdateError) {
          console.error("Error during stock update:", stockUpdateError);
          alert('Terjadi kesalahan saat memperbarui stok produk.');
      }
      // --- END STOCK UPDATE LOGIC ---


      // Mark as ordered
      await fetch(`http://localhost:5001/api/keranjang/${keranjangId}/markAsOrdered`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
 
      onClose();

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat memproses order.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="popup-order" className={styles['popup-order']}>
      <div className={styles['order-container']}>
        <span className={styles['close-popup-order']} onClick={onClose}>&times;</span>

        <div className={styles['order-content']}>
          <div className={styles['content-title']}><p>Our Bank Account</p></div>
          <div className={styles['content-isi']}><p>123456789012 a.n Maju Makmur | BCA</p></div>
        </div>

        <div className={styles['order-content']}>
          <div className={styles['content-isi']}>
            {[
              { label: 'Bank Name', name: 'bankName', value: form.bankName, type: 'text' },
              { label: "Account's Holder Name", name: 'accountName', value: form.accountName, type: 'text' },
              { label: 'Bank Account Number', name: 'accountNumber', value: form.accountNumber, type: 'number' },
              { label: 'Phone Number', name: 'nomorTelepon', value: form.nomorTelepon, type: 'tel' },
            ].map((field) => (
              <div className={styles['field-row']} key={field.name}>
                <label className={styles['field-label']} htmlFor={field.name}>{field.label}</label>
                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={field.value}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles['order-content']}>
          <div className={styles['content-isi']}>
            {[
              { label: 'Province', value: selectedProvinceId, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => handleProvinceChange(e.target.value), options: provinces, disabled: false, id: 'province-select' },
              { label: 'City', value: selectedRegencyId, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                  const regencyId = e.target.value;
                  setSelectedRegencyId(regencyId);
                  setForm((prev) => ({ ...prev, kabupaten: regencies.find((r) => r.id === regencyId)?.name || '' }));
                  setSelectedDistrictId('');
                  setSelectedVillageId('');
                  setDistricts([]);
                  setVillages([]);
                  fetchDistricts(regencyId);
                }, options: regencies, disabled: !selectedProvinceId, id: 'regency-select' },
              { label: 'District', value: selectedDistrictId, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                  const districtId = e.target.value;
                  setSelectedDistrictId(districtId);
                  setForm((prev) => ({ ...prev, kecamatan: districts.find((d) => d.id === districtId)?.name || '' }));
                  setSelectedVillageId('');
                  setVillages([]);
                  fetchVillages(districtId);
                }, options: districts, disabled: !selectedRegencyId, id: 'district-select' },
              { label: 'Urban Village', value: selectedVillageId, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                  const villageId = e.target.value;
                  setSelectedVillageId(villageId);
                  setForm((prev) => ({ ...prev, kelurahan: villages.find((v) => v.id === villageId)?.name || '' }));
                }, options: villages, disabled: !selectedDistrictId, id: 'village-select' },
            ].map((field) => (
              <div className={styles['field-row']} key={field.id}>
                <label className={styles['field-label']} htmlFor={field.id}>{field.label}</label>
                <select
                  id={field.id}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={field.disabled}
                  required
                >
                  <option value="">-- Select {field.label} --</option>
                  {field.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>
            ))}
            <div className={styles['field-row']}>
              <label className={styles['field-label']} htmlFor="alamatDetail">Detail Address</label>
              <input id="alamatDetail" type="text" name="alamatDetail" value={form.alamatDetail} onChange={handleInputChange} required />
            </div>
          </div>
        </div>

        <div className={styles['order-content']}>
          <div className={styles['content-title']}><p>Shipping Fee (Rp)</p></div>
          <div className={styles['content-isi']}><p>{shippingFee.toLocaleString()}</p></div>
          <p className={styles['info-text']}>
            Shipping fee is free if you're in Java Island.
          </p>
        </div>

        <div className={styles['order-content']}>
          <div className={styles['content-title']}><p>Total Price (Rp)</p></div>
          <div className={styles['content-isi']}><p>{(totalPrice + shippingFee).toLocaleString()}</p></div>
        </div>

        <div className={styles['order-content']}>
          <div className={styles['content-title']}><p>Transfer Receipt</p></div>
          <div className={styles['content-isi']}>
            <input type="file" id="file-input" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
            <button
              type="button"
              className={styles['file-attach-btn']}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              {form.buktiTransferFile ? form.buktiTransferFile.name : 'Attach File'}
            </button>
          </div>
          <p className={styles['info-text']}>
            Your order will be processed after payment is confirmed. Please attach your transfer receipt.
          </p>
        </div>
        
        {error && <p className={styles.errorText}>{error}</p>}

        <button className={styles['order-btn']} onClick={handleSubmit} disabled={uploading}>
          {uploading ? 'Processing...' : 'Order'}
        </button>
      </div>
    </div>
  );
}

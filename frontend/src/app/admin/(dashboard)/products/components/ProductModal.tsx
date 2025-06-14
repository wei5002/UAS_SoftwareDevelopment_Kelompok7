'use client';

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import styles from './productModal.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface Varian {
  id: string;
  size?: string;
  thickness?: number;
  hole?: number;
  harga: number;
  stok: number;
}

interface Produk {
  id: string;
  namaProduk: string;
  kategori: string;
  gambar?: string;
  status?: string;
  varian: Varian[];
}

interface ProductModalProps {
  product?: Produk | null;
  isNew: boolean;
  onClose: () => void;
  onSubmitProduct: (data: any, productId?: string) => Promise<void>;
  onDelete?: (productId: string) => Promise<void>;
  defaultKategori?: string;
}

export default function ProductModal({ product, isNew, onClose, onSubmitProduct, onDelete, defaultKategori }: ProductModalProps) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [formData, setFormData] = useState<Produk>(() => {
    if (isNew) {
      return {
        id: `new_${Date.now()}`,
        namaProduk: '',
        kategori: defaultKategori || '',
        gambar: '',
        status: 'AKTIF',
        varian: [{ id: `new_variant_${Date.now()}`, size: '', thickness: 0, hole: 0, harga: 0, stok: 0 }]
      };
    } else {
      return {
        ...JSON.parse(JSON.stringify(product || {})),
        status: product?.status || 'AKTIF'
      };
    }
  });
  const [selectedVarian, setSelectedVarian] = useState<Varian | null>(isNew ? null : (formData.varian?.[0] || null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(formData.gambar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  useEffect(() => {
    setFormData(() => {
      if (isNew) {
        return {
          id: `new_${Date.now()}`,
          namaProduk: '',
          kategori: defaultKategori || '',
          gambar: '',
          status: 'AKTIF',
          varian: [{ id: `new_variant_${Date.now()}`, size: '', thickness: 0, hole: 0, harga: 0, stok: 0 }]
        };
      } else {
        return {
          ...JSON.parse(JSON.stringify(product || {})),
          status: product?.status || 'AKTIF'
        };
      }
    });
    setSelectedVarian(isNew ? null : (product?.varian?.[0] || null));
    setImagePreview(isNew ? null : (product?.gambar || null));
    setSelectedFile(null);
    setIsEditing(isNew);
    setShowConfirmDeleteModal(false);
  }, [product, isNew, defaultKategori]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleVarianChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newVarian = [...formData.varian];
    const varianToUpdate = { ...newVarian[index] };
    if (['stok', 'harga', 'thickness', 'hole'].includes(name)) {
      (varianToUpdate as any)[name] = parseFloat(value) || 0;
    } else {
      (varianToUpdate as any)[name] = value;
    }
    newVarian[index] = varianToUpdate;
    setFormData(prev => ({ ...prev, varian: newVarian }));
  };

  const addVarian = () => {
    setFormData(prev => ({
      ...prev,
      varian: [...prev.varian, { id: `new_variant_${Date.now()}`, size: '', thickness: 0, hole: 0, harga: 0, stok: 0 }]
    }));
  };

  const removeVarian = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      varian: prev.varian.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleDeleteClick = () => {
    setShowConfirmDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmDeleteModal(false);
    if (onDelete && product?.id) {
      await onDelete(product.id);
      onClose();
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDeleteModal(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.namaProduk) {
      alert("Nama produk wajib diisi.");
      return;
    }
    if (isNew && !selectedFile) { 
      alert("Gambar produk wajib diisi untuk produk baru.");
      return;
    }
    if (formData.varian.length === 0) {
      alert("Setidaknya harus ada satu varian produk.");
      return;
    }
    if (formData.varian.some(v => v.stok <= 0 || v.harga <= 0)) {
      alert("Stok dan harga varian harus lebih besar dari 0.");
      return;
    }

    setIsSubmitting(true);
    let finalImageUrl = formData.gambar;

    if (selectedFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('image', selectedFile);
      uploadFormData.append('namaProduk', formData.namaProduk);
      try {
        const response = await fetch(`${API_BASE_URL}/upload-produk`, {
          method: 'POST',
          headers: { 'Authorization': localStorage.getItem('token_admin') || '' },
          body: uploadFormData,
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.errors || 'Upload gambar gagal.');
        }
        const result = await response.json();
        finalImageUrl = result.url;
      } catch (err: any) {
        alert(`Error saat upload gambar: ${err.message}`);
        setIsSubmitting(false);
        return;
      }
    }

    const payload = {
      namaProduk: formData.namaProduk,
      kategori: formData.kategori,
      gambar: finalImageUrl,
      status: formData.status,
      varian: formData.varian.map(v => {
        const { id, ...rest } = v;
        return String(id).startsWith('new_') ? rest : v;
      })
    };
    
    try {
      await onSubmitProduct(payload, isNew ? undefined : product?.id);
      onClose();
    } catch (err: any) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.popupOverlay} data-is-new={isNew}>
      <div className={styles.popupContent}>
        <span className={styles.closeBtn} onClick={onClose}>&times;</span>
        <div className={styles.header}>
          <h2>{isNew ? 'Tambah Produk Baru' : (isEditing ? 'Edit Produk' : 'Detail Produk')}</h2>
          <div className={styles.headerActions}>
            {!isNew && !isEditing && <button className={styles.editBtn} onClick={() => setIsEditing(true)}>Edit</button>}
            {!isNew && onDelete && <button className={styles.deleteBtn} onClick={handleDeleteClick}>Hapus</button>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.leftPanel}>
            <div className={styles.imageWrapper} onClick={handleUploadClick} style={{ cursor: isEditing ? 'pointer' : 'default' }}>
              {imagePreview ? (
                <Image 
                  src={imagePreview} 
                  alt={formData.namaProduk || "Preview Gambar"}
                  width={200} 
                  height={200} 
                  className={styles.productImage} 
                  objectFit="cover" 
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/Admin/img/default-placeholder.png'; }}
                />
              ) : (
                <div className={styles.placeholderImage}>Pilih Gambar</div>
              )}
              {isEditing && <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />}
              {isEditing && <div className={styles.imageOverlay}>{isSubmitting ? 'Mengunggah...' : 'Ubah Foto'}</div>}
            </div>
            {!isEditing && <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />}
            
            <label htmlFor="namaProduk">Nama Produk</label>
            <input type="text" id="namaProduk" name="namaProduk" value={formData.namaProduk} onChange={handleInputChange} disabled={!isEditing} required/>
            
            <label htmlFor="kategori">Kategori</label>
            {isEditing ? (
              <input type="text" id="kategori" name="kategori" value={formData.kategori} onChange={handleInputChange} required/>
            ) : (
              <p>{formData.kategori}</p>
            )}

            {(isEditing || isNew) && (
              <>
                <label htmlFor="status">Status Produk</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={styles.statusSelect}
                >
                  <option value="AKTIF">AKTIF</option>
                  <option value="NONAKTIF">NONAKTIF</option>
                </select>
              </>
            )}
            {!isEditing && !isNew && (
              <>
                <label>Status Produk</label>
                <p>{formData.status}</p>
              </>
            )}

          </div>

          <div className={styles.rightPanel}>
            <h4>Varian Produk</h4>
            {!isEditing && !isNew && (
              <>
                <div className={styles.variantPills}>
                  {formData.varian.length > 0 ? formData.varian.map(v => (
                    <button key={v.id} type="button" onClick={() => setSelectedVarian(v)} className={selectedVarian?.id === v.id ? styles.activePill : ''}>
                      {v.size || `T:${v.thickness} H:${v.hole}`}
                    </button>
                  )) : <p>Tidak ada varian tersedia.</p>}
                </div>
                {selectedVarian && (
                  <div className={styles.detailBox}>
                    <div className={styles.detailItem}><span>Size</span> <p>{selectedVarian.size || 'N/A'}</p></div>
                    <div className={styles.detailItem}><span>Thickness</span> <p>{selectedVarian.thickness || 'N/A'} mm</p></div>
                    <div className={styles.detailItem}><span>Hole</span> <p>{selectedVarian.hole || 'N/A'} mm</p></div>
                    <div className={styles.detailItem}><span>Price</span> <p>Rp {selectedVarian.harga.toLocaleString('id-ID')}</p></div>
                    <div className={styles.detailItem}><span>Stock</span> <p>{selectedVarian.stok} pcs</p></div>
                  </div>
                )}
              </>
            )}

            {(isEditing || isNew) && (
              <>
                <div className={styles.variantsHeader}>
                  <span>Size</span><span>Thickness(mm)</span><span>Hole(mm)</span><span>Price (Rp)</span><span>Stock</span><span></span>
                </div>
                <div className={styles.variantsList}>
                  {formData.varian.map((v, index) => (
                    <div key={v.id || index} className={styles.variantRow}>
                      <input type="text" value={v.size || ''} name="size" onChange={(e) => handleVarianChange(index, e)} placeholder="e.g., 1x2"/>
                      <input type="number" step="0.1" value={v.thickness || ''} name="thickness" onChange={(e) => handleVarianChange(index, e)} placeholder="e.g., 1.5"/>
                      <input type="number" step="0.1" value={v.hole || ''} name="hole" onChange={(e) => handleVarianChange(index, e)} placeholder="e.g., 5"/>
                      <input type="number" value={v.harga} name="harga" onChange={(e) => handleVarianChange(index, e)} required/>
                      <input type="number" value={v.stok} name="stok" onChange={(e) => handleVarianChange(index, e)} required/>
                      <button type="button" onClick={() => removeVarian(index)} className={styles.removeBtn}>&times;</button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addVarian} className={styles.addBtn}>+ Tambah Varian</button>
                <div className={styles.formActions}>
                  {!isNew && <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelBtn}>Batal</button>}
                  <button type="submit" className={styles.saveBtn} disabled={isSubmitting}>{isNew ? 'Tambah Produk' : (isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan')}</button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>

      {showConfirmDeleteModal && (
        <div className={styles.confirmModalOverlay}>
          <div className={styles.confirmModalContent}>
            <h3>Konfirmasi Penghapusan</h3>
            <p>Yakin ingin menghapus produk "{product?.namaProduk || ''}"?</p>
            <div className={styles.confirmModalActions}>
              <button className={styles.cancelBtn} onClick={handleCancelDelete}>Batal</button>
              <button className={styles.deleteBtn} onClick={handleConfirmDelete}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

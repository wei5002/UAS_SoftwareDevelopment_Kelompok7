'use client';

import Image from 'next/image';

type Product = {
  namaProduk: string;
  deskripsi: string;
  harga: number;
  gambar: string;
};

type ProductPopupProps = {
  product: Product;
  onClose: () => void;
};

export default function ProductPopup({ product, onClose }: ProductPopupProps) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{product.namaProduk}</h2>
        <Image
          src={product.gambar}
          alt={product.namaProduk}
          width={400}
          height={300}
          style={{ objectFit: 'cover', borderRadius: '8px', margin: '1rem 0' }}
        />
        <p><strong>Deskripsi:</strong> {product.deskripsi}</p>
        <p><strong>Harga:</strong> Rp {product.harga.toLocaleString()}</p>
      </div>
    </div>
  );
}

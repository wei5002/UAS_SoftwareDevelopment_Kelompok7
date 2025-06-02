'use client';

import { useState } from 'react';
import CustomerNavbar from '@/app/components/customNavbar';
import FooterCustom from '@/app/components/footerCustom';

export default function Cart() {
  const [menuItem, setMenuItem] = useState('');

  return (
    <>
      <CustomerNavbar />

      <main>
        <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>Cart</h1>

        {/* Konten cart bisa ditambahkan di sini */}
        <div className="cart-container">
          {/* Daftar item keranjang belanja */}
        </div>
      </main>
      <FooterCustom />
    </>
  );
}

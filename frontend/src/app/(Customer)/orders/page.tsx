'use client';

import { useState } from 'react';
import CustomerNavbar from '@/app/components/customNavbar';
import FooterCustom from '@/app/components/footerCustom';

export default function Order() {
  const [menuItem, setMenuItem] = useState('');

  return (
    <>
      <CustomerNavbar />

      <main>
        <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>Your Orders</h1>

        {/* Konten daftar pesanan */}
        <div className="order-container">
          {/* Tampilkan order pelanggan di sini */}
        </div>
      </main>
      <FooterCustom />
    </>
  );
}

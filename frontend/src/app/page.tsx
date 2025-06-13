'use client';

import Image from 'next/image';
import Header from '@/app/header';
import Footer from '@/app/footer';
import Link from 'next/link';
import './home.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/produk');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return null; 
  }

  return (
    <>
      <Header />
    <main className="pt-[100px]">

      {/* Hero Section */}
      <section className="hero">
        <Image
          src="/assets/images/hero.jpg"
          alt="hero"
          width={1920}
          height={300}
          className="hero-bg"
        />
        <div className="hero-text">
          <h1>STRONG, DURABLE, READY TO SHIP - <br /> JUST LIKE YOU NEED</h1>
          <div>
            <button
              onClick={() => window.location.href='/auth/login'}
              className="hero-login"
            >
              LOG IN
            </button>
            <button
              onClick={() => window.location.href='/auth/signup'}
              className="hero-signup"
            >
              SIGN UP
            </button>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="introduction">
        <div className="intro-decor"></div>
        <p className="intro-desc">
          Established in 2000, we specialize in the fabrication and distribution of high-quality stainless steel materials. Trusted by clients for over two decades, we are committed to delivering excellence and reliability in every product.
        </p>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <p>A wide selection of Stainless Steel Materials</p>
        <p>We offer premium-grade stainless steel angles, pipes, sheets, and more</p>
        <div className="category-grid">
          <div className="cat-item">
            <Image
              src="/assets/images/angle-bar.jpg"
              alt="Angle Bar"
              width={300}
              height={400}
            />
            <h4>ANGLE BAR</h4>
          </div>

          <div className="cat-item">
            <Image
              src="/assets/images/pipes.jpg"
              alt="Pipes"
              width={300}
              height={400}
            />
            <h4>PIPES</h4>
          </div>

          <div className="cat-item">
            <Image
              src="/assets/images/plates.jpg"
              alt="Plates"
              width={300}
              height={400}
            />
            <h4>PLATES</h4>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews">
        <h3>Trusted By Our Clients</h3>
        <div className="review-wrapper">
          <div className="review-track">

            <div className="review-card">
              ⭐⭐⭐⭐⭐<br />
              "Selalu puas dengan Maju Makmur, kualitas sesuai harga, pengiriman tepat waktu."<br />
              <strong>Ayu</strong>
            </div>

            <div className="review-card">
              ⭐⭐⭐⭐⭐<br />
              "Pelayanannya sangat ramah sekali dan stok barangnya sangat banyak dan harga sangat bersaing. Terima kasih."<br />
              <strong>Oman Sumantri</strong>
            </div>

            <div className="review-card">
              ⭐⭐⭐⭐⭐<br />
              "Happy with the service! Keep up the good word!"<br />
              <strong>Erwin</strong>
            </div>

            <div className="review-card">
              ⭐⭐⭐⭐<br />
              "Produk berkualitas dan sesuai dengan deskripsi. Akan order lagi."<br />
              <strong>Rina</strong>
            </div>

            <div className="review-card">
              ⭐⭐⭐⭐⭐<br />
              "Customer service sangat membantu. Proses order cepat dan mudah."<br />
              <strong>Andi</strong>
            </div>

            <div className="review-card">
              ⭐⭐⭐⭐⭐<br />
              "Barang dikemas dengan sangat rapi. Sangat recommended."<br />
              <strong>Fajar</strong>
            </div>

            <div className="review-card">
              ⭐⭐⭐⭐<br />
              "Sudah beberapa kali repeat order di sini. Selalu puas."<br />
              <strong>Siti</strong>
            </div>

            <div className="review-card">
              ⭐⭐⭐⭐⭐<br />
              "Pengiriman cepat. Barang sesuai pesanan."<br />
              <strong>Bayu</strong>
            </div>

            <div className="review-card">
              ⭐⭐⭐⭐⭐<br />
              "Produk stainless steel sangat bagus dan kuat."<br />
              <strong>Dewi</strong>
            </div>

          </div>
        </div>
      </section>

    </main>
    <Footer />
    </>
  );
}

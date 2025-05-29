"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "./navbar";
import Footer from "./footer";
import ReviewSlider from "./components/ReviewSlider";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <Image
          src="/assets/images/hero.jpg"
          alt="hero"
          className="hero-bg"
          width={1920}
          height={300}
        />
        <div className="hero-text">
          <h1>
            STRONG, DURABLE, READY TO SHIP - <br /> JUST LIKE YOU NEED
          </h1>
          <button
            className="hero-login"
            onClick={() => router.push("/login")}
          >
            LOG IN
          </button>
          <button
            className="hero-signup"
            onClick={() => router.push("/signup")}
          >
            SIGN UP
          </button>
        </div>
      </section>

      {/* Introduction */}
      <section className="introduction">
        <div className="intro-decor"></div>
        <p className="intro-desc">
          Established in 2000, we specialize in the fabrication and distribution of high-quality
          stainless steel materials. Trusted by clients for over two decades, we are committed to
          delivering excellence and reliability in every product.
        </p>
      </section>

      {/* Categories */}
      <section className="categories">
        <p>A wide selection of Stainless Steel Materials</p>
        <p>We offer premium-grade stainless steel angles, pipes, sheets, and more</p>
        <div className="category-grid">
          <div className="cat-item">
            <Image src="/assets/images/angle-bar.jpg" alt="Angle Bar" width={300} height={400} />
            <h4>ANGLE BAR</h4>
          </div>
          <div className="cat-item">
            <Image src="/assets/images/pipes.jpg" alt="Pipes" width={300} height={400} />
            <h4>PIPES</h4>
          </div>
          <div className="cat-item">
            <Image src="/assets/images/plates.jpg" alt="Plates" width={300} height={400} />
            <h4>PLATES</h4>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ReviewSlider />

      <Footer />
    </>
  );
}

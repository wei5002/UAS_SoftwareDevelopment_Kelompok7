'use client';

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function CustomerNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <>
      <header>
        <div className="container header-content">
          <div
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            <Image
              src="/assets/images/majumakmur.png"
              alt="Logo"
              className="logo"
              width={200}
              height={80}
            />
          </div>

          <div className="tagline">
            Your trusted supplier for High Quality Stainless Steel Materials
          </div>

          <div className="login-signup-btn">
            <button className="logout-btn" onClick={handleLogout}>
              LOG OUT
            </button>
          </div>
        </div>
      </header>

      <nav className="navbar">
        <a className={pathname === "/produk" ? "active" : ""} href="/produk">PRODUCTS</a>
        <a className={pathname === "/cart" ? "active" : ""} href="/cart">CART</a>
        <a className={pathname === "/orders" ? "active" : ""} href="/orders">YOUR ORDERS</a>
      </nav>
    </>
  );
}

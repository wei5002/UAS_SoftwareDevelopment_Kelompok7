'use client';

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CustomerNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true jika token ada
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <>
      {/* Header */}
      <header>
        <div className="container header-content">
          <div style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
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
            {isLoggedIn === null ? (
              <div style={{ width: 140 }}></div> // Spacer untuk jaga posisi
            ) : !isLoggedIn ? (
              <>
                {(pathname === "/" || pathname === "/produk" || pathname === "/cart" || pathname === "/orders") && (
                  <>
                    <button className="login-btn" onClick={() => router.push("/login")}>
                      LOG IN
                    </button>
                    <button className="signup-btn" onClick={() => router.push("/signup")}>
                      SIGN UP
                    </button>
                  </>
                )}
                {pathname === "/login" && (
                  <button className="signup-btn" onClick={() => router.push("/signup")}>
                    SIGN UP
                  </button>
                )}
                {pathname === "/signup" && (
                  <button className="login-btn" onClick={() => router.push("/login")}>
                    LOG IN
                  </button>
                )}
              </>
            ) : (
              <button className="login-btn" onClick={handleLogout}>
                LOG OUT
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navbar */}
      <nav className="navbar">
        <a className={pathname === "/produk" ? "active" : ""} href="/produk">
          PRODUCTS
        </a>
        <a className={pathname === "/cart" ? "active" : ""} href="/cart">
          CART
        </a>
        <a className={pathname === "/orders" ? "active" : ""} href="/orders">
          YOUR ORDERS
        </a>
      </nav>
    </>
  );
}

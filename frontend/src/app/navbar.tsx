"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
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
          {pathname === "/" && (
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
        </div>
      </div>
    </header>
  );
}

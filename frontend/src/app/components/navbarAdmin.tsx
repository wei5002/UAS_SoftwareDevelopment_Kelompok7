"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function NavbarAdmin() {
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
          ADMIN PANEL - Stainless Steel Inventory
        </div>

        <div className="login-signup-btn">
          {pathname === "/admin/login" && (
            <button
              className="signup-btn"
              onClick={() => router.push("/admin/signup")}
            >
              SIGNUP
            </button>
          )}
          {pathname === "/admin/signup" && (
            <button
              className="login-btn"
              onClick={() => router.push("/admin/login")}
            >
              LOGIN
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <body>
        <div key={pathname} className="page-container">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}

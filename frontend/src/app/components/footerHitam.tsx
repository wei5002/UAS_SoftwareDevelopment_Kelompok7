'use client';

import styles from './footerHitam.module.css';

export default function FooterHitam() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>

        {/* Kolom Pertama: Info Alamat & Jam Buka */}
        <div className={styles.footerColumn}>
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>ADDRESS</h4>
            <p className={styles.footerText}>
              Jln. Mangga Besar 1 no 1,<br />
              Kec. Taman Sari, Jakarta Barat, 11180
            </p>
          </div>
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>OPENING HOURS</h4>
            <p className={styles.footerText}>
              Monday - Friday<br />
              09.00 - 17.00 WIB
            </p>
          </div>
        </div>

        {/* Kolom Kedua: Info Kontak */}
        <div className={styles.footerColumn}>
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>CONTACT US</h4>
            <p className={styles.footerText}>
              <strong>EMAIL:</strong><br />
              steel.majumakmur@gmail.com
            </p>
            <p className={styles.footerText}>
              <strong>PHONE NUMBER:</strong><br />
              0853-1379-6466
            </p>
          </div>
        </div>

      </div>
      <div className={styles.copyright}>
        © {new Date().getFullYear()} Maju Makmur Stainless Steel. All Rights Reserved.
      </div>
    </footer>
  );
}
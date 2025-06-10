'use client';

import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>

        {/* Address & Opening Hours */}
        <div className={styles.footerGridOne}>
          <div>
            <h4>ADDRESS</h4>
            <p className={styles.footerText}>
              Jln. Mangga Besar 1 no 1,<br />
              Kec. Taman Sari, Jakarta Barat, 11180
            </p>
          </div>

          <br />

          <div>
            <p className={styles.footerText}>
              <strong>OPENING HOURS</strong><br />
              Monday - Friday<br />
              09.00 - 17.00 WIB
            </p>
          </div>
        </div>

        {/* Contact Us Title */}
        <div className={styles.footerGridTwo}>
          <div>
            <h4>CONTACT US</h4>
          </div>
        </div>

        {/* Email & Phone */}
        <div className={styles.footerGridThree}>
          <div>
            <p className={styles.footerText}>
              <strong>EMAIL:</strong><br />
              steel.majumakmur@gmail.com
            </p>
          </div>

          <div>
            <p className={styles.footerText}>
              <strong>PHONE NUMBER:</strong><br />
              0853-1379-6466
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}

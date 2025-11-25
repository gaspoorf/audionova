"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import Header from '@/components/Header';

export default function ResultPage() {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const s1 = Number(localStorage.getItem('sound1Score') || 0);
    const s2 = Number(localStorage.getItem('sound2Score') || 0);
    const s3 = Number(localStorage.getItem('sound3Score') || 0);

    const finalScore = Math.round((s1 + s2 + s3) / 3);
    setScore(finalScore);
  }, []);

  if (score === null) return <div>Loading...</div>;

  // Calculate active dash (1 to 5)
  const activeDash = Math.max(1, Math.ceil(score / 20));

  return (
    <main className={styles.container}>
      <Header />
      <h1 className={styles.title}>You're a bit <span>below average</span></h1>
      
      <div className={styles.resultGraph}>
        <div className={styles.graphLabel}>YOUR RESULTS</div>
        <div className={styles.dashesContainer}>
          {[1, 2, 3, 4, 5].map((dash) => (
            <div 
              key={dash} 
              className={`${styles.dash} ${dash === activeDash ? styles.active : ''}`}
            />
          ))}
        </div>
        <div className={styles.averageMarker}>
          <span>AVERAGE</span>
        </div>
      </div>

      <button className={styles.button} onClick={() => window.open('https://www.audionova.com', '_blank')}>
        Book your appointment
      </button>
      
      <button className={styles.inviteLink}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16 6 12 2 8 6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
        Invite someone to take the test
      </button>

      <div className={styles.productCard}>
        <div className={styles.productLabel}>RECOMMENDED FOR YOU</div>
        <h2 className={styles.productTitle}>Phonak Virto™ R Infinio</h2>
        <div className={styles.productImage}>
          {/* Image placeholder */}
        </div>
        <button className={styles.productButton}>Discover the product</button>
      </div>

      <div className={styles.contactSection}>
        <div className={styles.contactLabel}>NEED ASSISTANCE?</div>
        <h2 className={styles.contactTitle}>We're here for you</h2>
        <div className={styles.contactList}>
          <a href="#">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            Find a center
          </a>
          <a href="tel:0801907966">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            0 801 907 966
          </a>
          <a href="mailto:crc@auditionsante.fr">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
            crc@auditionsante.fr
          </a>
        </div>
      </div>
    </main>
  );
}

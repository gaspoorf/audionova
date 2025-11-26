import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './ResultView.module.scss';
import Header from '@/components/Header';

export default function ResultView() {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const s1 = Number(localStorage.getItem('sound1Score') || 0);
    const s2 = Number(localStorage.getItem('sound2Score') || 0);
    const s3 = Number(localStorage.getItem('sound3Score') || 0);

    // Calculate average (0-100)
    const finalScore = Math.round((s1 + s2 + s3) / 3);
    setScore(finalScore);
  }, []);

  if (score === null) return <div>Loading...</div>;

  // Map 0-100 score to 1-5 scale
  // 0-20: 1, 21-40: 2, 41-60: 3, 61-80: 4, 81-100: 5
  const scoreLevel = Math.min(5, Math.max(1, Math.ceil(score / 20)));

  // Title logic
  const getTitle = () => {
    switch (scoreLevel) {
      case 1: return <>Your hearing is quite<span>limited</span></>;
      case 2: return <>You have a <span>below-average</span> hearing sensitivity</>;
      case 3: return <>Your have an <span>average</span> hearing sensitivity</>;
      case 4: return <>You have <span>above-average</span> hearing sensitivity</>;
      case 5: return <>You have <span>excellent</span> hearing sensitivity</>;
      default: return <>Error</>;
    }
  };

  // Rotation for the needle (center of each segment)
  // Segments are 36 degrees each (180 / 5)
  // Centers: 18, 54, 90, 126, 162 degrees from left
  // CSS rotation is -90 (left) to 90 (right)
  // So: -72, -36, 0, 36, 72
  const rotations = [-72, -36, 0, 36, 72];
  const rotation = rotations[scoreLevel - 1];

  // Gauge segment calculations
  // Total arc length for radius 80 is ~251px
  // 5 segments with 4px gaps
  // (5 * segment) + (4 * gap) = 251
  // 5s + 16 = 251 => 5s = 235 => s = 47
  const segmentLength = 47;
  const gapLength = 4;
  
  // Construct dasharray for the green path to show cumulative progress
  // e.g. for level 3: "47 4 47 4 47 1000"
  const activeDashArray = Array.from({length: scoreLevel}).map((_, i) => {
      return (i === scoreLevel - 1) ? `${segmentLength} 1000` : `${segmentLength} ${gapLength}`;
  }).join(" ");

  return (
    <main className={styles.container}>
      <Header />
      <h1 className={styles.title}>{getTitle()}</h1>
      
      <div className={styles.resultGraph}>
        <div className={styles.gaugeContainer}>
          <div className={styles.averageLabel}>
            <p>Average</p>
          </div>
          <svg className={styles.gaugeSvg} viewBox="0 0 200 100">
            {/* Background Segments (Grey) */}
            <path 
               d="M 20 100 A 80 80 0 0 1 180 100" 
               stroke="rgba(255,255,255,0.2)"
               strokeWidth="20"
               fill="none"
               strokeDasharray={`${segmentLength} ${gapLength}`}
             />
             
            {/* Active Segments (Green) - Cumulative */}
             <path 
               d="M 20 100 A 80 80 0 0 1 180 100" 
               stroke="#66FF99"
               strokeWidth="20"
               fill="none"
               strokeDasharray={activeDashArray}
               className={styles.activeSegmentGlow}
             />
          </svg>
          
          {/* Needle / Spotlight */}
          <div 
            className={styles.spotlight} 
            style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
          />
          
          <div className={styles.resultLabel}>Your result</div>
        </div>
      </div>

      {scoreLevel <= 3 && (
        <button className={styles.button} onClick={() => window.open('https://www.audionova.com', '_blank')}>
          Get a full hearing check
        </button>
      )}
      
      <button className={styles.inviteLink}>
        Invite someone to try the test
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </button>

      <div className={styles.card}>
        <div className={styles.cardLabel}>RECOMMENDED FOR YOU</div>
        <h2 className={styles.cardTitle}>Phonak Virto™ R Infinio</h2>
        <div className={styles.productImage}>
          <Image 
            src="/img/phonak.webp" 
            alt="Phonak Virto™ R Infinio" 
            width={140} 
            height={140} 
            className={styles.productImg}
          />
        </div>
        <button className={styles.outlineButton}>Discover the product</button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardLabel}>NEED ASSISTANCE?</div>
        <h2 className={styles.cardTitle}>We're here for you</h2>
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

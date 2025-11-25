"use client";

import styles from './ProgressBar.module.scss';

export default function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className={styles.container}>
      <div className={styles.label}>AUDIO TEST {current}/{total}</div>
      <div className={styles.bars}>
        {Array.from({ length: total }).map((_, i) => (
          <div 
            key={i} 
            className={`${styles.bar} ${i + 1 === current ? styles.active : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

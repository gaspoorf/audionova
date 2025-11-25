"use client";

import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import Header from '@/components/Header';

export default function AgeSelectionPage() {
  const router = useRouter();

  const handleSelection = (ageGroup: string) => {
    localStorage.setItem('ageGroup', ageGroup);
    router.push('/result');
  };

  return (
    <main className={styles.container}>
      <Header />
      
      <div className={styles.label}>ONE LAST THING</div>
      <h1 className={styles.title}>For a more personalized result, please select your age group</h1>
      
      <div className={styles.buttonGroup}>
        <button 
          className={`${styles.button} ${styles.primary}`}
          onClick={() => handleSelection('under-50')}
        >
          Under 50
        </button>
        <button 
          className={styles.button}
          onClick={() => handleSelection('51-70')}
        >
          51-70
        </button>
        <button 
          className={styles.button}
          onClick={() => handleSelection('70+')}
        >
          70+
        </button>
      </div>
    </main>
  );
}

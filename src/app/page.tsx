"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import Header from '@/components/Header';

export default function Home() {
  const [step, setStep] = useState<'welcome' | 'instructions'>('welcome');
  const router = useRouter();

  const handleStart = () => {
    setStep('instructions');
  };

  const handleReady = () => {
    router.push('/test/restaurant');
  };

  return (
    <main className={styles.container}>
      <div className={styles.backgroundLines}>
        <svg viewBox="0 0 375 812" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M-50 250 C 50 200, 300 200, 400 280" stroke="#009A65" strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M300 0 C 300 100, 250 250, 400 300" stroke="#009A65" strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M-100 600 C 50 700, 200 800, 400 900" stroke="#009A65" strokeWidth="1" fill="none" opacity="0.5" />
        </svg>
      </div>

      <Header />
      
      {step === 'welcome' && (
        <>
          <h1 className={styles.title}>
            <span className={styles.lightGreen}>Hearing</span>
            <span className={styles.darkGreen}>flash test</span>
          </h1>
          <p className={styles.description}>
            3 quick tests to reveal<br />your current hearing level
          </p>
          <div className={styles.buttonWrapper}>
            <button className={styles.button} onClick={handleStart}>
              Start<br />the test
            </button>
          </div>
        </>
      )}

      {step === 'instructions' && (
        <>
          <h1 className={styles.title}>
            <span className={styles.lightGreen}>Before</span>
            <span className={styles.darkGreen}>you start</span>
          </h1>
          <div className={styles.instructionList}>
            <div className={styles.instructionItem}>
              <div className={styles.iconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <p>Prefer a quiet place</p>
            </div>
            <div className={styles.instructionItem}>
              <div className={styles.iconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
              </div>
              <p>It is recommended that<br />you use earphones if you can</p>
            </div>
            <div className={styles.instructionItem}>
              <div className={styles.iconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              </div>
              <p>Adjust your volume to 100%</p>
            </div>
          </div>
          <div className={styles.buttonWrapper}>
            <button className={styles.button} onClick={handleReady}>
              Ready?
            </button>
          </div>
        </>
      )}
    </main>
  );
}

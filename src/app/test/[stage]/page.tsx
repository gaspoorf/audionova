"use client";

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

const STAGES = ['restaurant', 'street', 'music'];
const TEST_DURATION = 30000; // 30 seconds

const STAGE_CONFIG: Record<string, { title: string; description: string; next: string; keyword: string }> = {
  restaurant: {
    title: "Simulation of a restaurant atmosphere",
    keyword: "restaurant",
    description: "When you are ready, press the button when you begin to hear something.",
    next: "street"
  },
  street: {
    title: "Simulation of a street atmosphere",
    keyword: "street",
    description: "When you are ready, press the button when you begin to hear something.",
    next: "music"
  },
  music: {
    title: "Simulation of a musical atmosphere",
    keyword: "musical",
    description: "When you are ready, press the button when you begin to hear something.",
    next: "age-selection"
  }
};

export default function TestPage({ params }: { params: Promise<{ stage: string }> }) {
  const { stage } = use(params);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [status, setStatus] = useState<'intro' | 'countdown' | 'testing' | 'success'>('intro');
  const [countdown, setCountdown] = useState(3);
  const [startTime, setStartTime] = useState<number | null>(null);

  const config = STAGE_CONFIG[stage];
  const stageIndex = STAGES.indexOf(stage) + 1;

  useEffect(() => {
    // Reset state when stage changes
    setStatus('intro');
    setCountdown(3);
    setStartTime(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [stage]);

  useEffect(() => {
    if (status === 'testing' && startTime) {
      const interval = setInterval(() => {
        if (!audioRef.current) return;
        
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / TEST_DURATION);
        const volume = Math.pow(progress, 2); // 0 to 1
        
        audioRef.current.volume = volume;

        if (progress >= 1) {
          handleHeard();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [status, startTime]);

  const startTest = () => {
    setStatus('countdown');
    let count = 3;
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        beginAudio();
      }
    }, 1000);
  };

  const beginAudio = () => {
    setStatus('testing');
    setStartTime(Date.now());
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  };

  const handleHeard = () => {
    if (status !== 'testing' || !startTime) return;
    
    const elapsed = Date.now() - startTime;
    const progress = Math.min(1, elapsed / TEST_DURATION);
    const volumeAtClick = Math.pow(progress, 2) * 100; // 0 to 100
    const score = Math.max(0, Math.round(100 - volumeAtClick));

    // Save score
    const scoreKey = `sound${STAGES.indexOf(stage) + 1}Score`;
    localStorage.setItem(scoreKey, score.toString());

    setStatus('success');
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Auto advance after success (optional, but user flow suggests validation screen then next)
    setTimeout(() => {
       handleNext();
    }, 2000);
  };

  const handleNext = () => {
    if (config.next === 'result') {
      router.push('/result');
    } else if (config.next === 'age-selection') {
      router.push('/age-selection');
    } else {
      router.push(`/test/${config.next}`);
    }
  };

  if (!config) return <div>Invalid Stage</div>;

  // Helper to bold/color the keyword
  const renderTitle = () => {
    const parts = config.title.split(config.keyword);
    return (
      <>
        {parts[0]}
        <strong>{config.keyword}</strong>
        {parts[1]}
      </>
    );
  };

  return (
    <main className={styles.container}>
      <Header />
      <ProgressBar current={stageIndex} total={3} />
      
      <audio ref={audioRef} src={`/sounds/${stage}.mp3`} loop />

      <h1 className={styles.title}>{renderTitle()}</h1>

      {status === 'intro' && (
        <>
          <p className={styles.description}>{config.description}</p>
          <button className={styles.circleButton} onClick={startTest}>
            <span className={styles.buttonText}>Press to launch the test</span>
          </button>
          <button className={styles.backButton} onClick={() => router.back()}>Back</button>
        </>
      )}

      {status === 'countdown' && (
        <div className={styles.circleButton}>
          <div className={styles.countdownContainer}>
            <svg className={styles.countdownSvg} viewBox="0 0 100 100">
              <circle 
                className={styles.countdownCircleBackground} 
                cx="50" cy="50" r="48" 
              />
              <circle 
                className={styles.countdownCircleProgress} 
                cx="50" cy="50" r="48"
              />
            </svg>
            <div className={styles.countdown}>{countdown}</div>
          </div>
        </div>
      )}

      {status === 'testing' && (
        <button className={`${styles.circleButton} ${styles.testing}`} onClick={handleHeard}>
           <div 
             className={styles.stageImage}
             style={{ backgroundImage: `url(/img/${stage}.jpg), linear-gradient(#ddd, #ddd)` }} 
           />
           <div className={styles.overlay}>
             <div className={styles.soundIcon}>
               <span></span><span></span><span></span><span></span><span></span>
             </div>
             <span className={styles.overlayText}>Press here when you hear something</span>
           </div>
        </button>
      )}

      {status === 'success' && (
        <div className={styles.circleButton}>
          <div className={styles.successCircle}>
             <span className={styles.successIcon}>✓</span>
          </div>
        </div>
      )}
    </main>
  );
}

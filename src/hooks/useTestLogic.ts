import { useState, useEffect, useRef, useCallback } from 'react';

const STAGE_CONFIG: Record<string, { title: string; description: string; next: string; keyword: string }> = {
  restaurant: {
    title: "Hear\nthe restaurant\nambiance",
    keyword: "restaurant",
    description: "A sound will play for about X seconds and will gradually get louder. Press the button as soon as you hear it.",
    next: "street"
  },
  street: {
    title: "Hear\nthe street\nambiance",
    keyword: "street",
    description: "A sound will play for about X seconds and will gradually get louder. Press the button as soon as you hear it.",
    next: "music"
  },
  music: {
    title: "Hear\nthe musical\nambiance",
    keyword: "musical",
    description: "A sound will play for about X seconds and will gradually get louder. Press the button as soon as you hear it.",
    next: "age-selection"
  }
};

const TEST_DURATION = 30000;

export function useTestLogic(stage: string, onNext: (next: string) => void) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<'intro' | 'countdown' | 'testing' | 'success'>('intro');
  const [isExitingIntro, setIsExitingIntro] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [startTime, setStartTime] = useState<number | null>(null);

  const config = STAGE_CONFIG[stage];

  useEffect(() => {
    setStatus('intro');
    setIsExitingIntro(false);
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
        
        // Power of 6 curve: starts very low (0.0001) and stays low for a long time
        // At 15s (50%), volume is only ~1.5%
        // At 25s (83%), volume reaches ~33%
        // This ensures people with good hearing don't hear it immediately at "medium" volume
        const volume = 0.0001 + (Math.pow(progress, 6) * 0.9999);
        
        audioRef.current.volume = Math.min(1, volume);
        if (progress >= 1) handleHeard();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [status, startTime]);

  const startTest = useCallback(() => {
    setIsExitingIntro(true);
    
    // Wait for fade out animation (500ms)
    setTimeout(() => {
      setStatus('countdown');
      setIsExitingIntro(false);
      
      // Play sound for 3
      new Audio('/sounds/effects/count.mp3').play().catch(() => {});

      let count = 3;
      const timer = setInterval(() => {
        count--;
        if (count > 0) {
          new Audio('/sounds/effects/count.mp3').play().catch(() => {});
        }
        setCountdown(count);
        if (count === 0) {
          clearInterval(timer);
          beginAudio();
        }
      }, 1000);
    }, 500);
  }, []);

  const beginAudio = () => {
    setStatus('testing');
    setStartTime(Date.now());
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  };

  const handleHeard = useCallback(() => {
    if (status !== 'testing' || !startTime) return;
    
    const elapsed = Date.now() - startTime;
    const progress = Math.min(1, elapsed / TEST_DURATION);
    
    // Scoring Logic:
    // We decouple the score from the volume curve.
    // Volume stays low for a long time (Power of 6) to avoid "everyone hears it at once".
    // But Score drops faster (Power of 2) to penalize waiting.
    // Example: At 15s (50%), Volume is ~1.5% (tiny), but Score is 75/100 (already lost 25pts).
    const scorePenalty = Math.pow(progress, 2);
    const score = Math.max(0, Math.round(100 - (scorePenalty * 100)));

    const scoreKey = `sound${['restaurant', 'street', 'music'].indexOf(stage) + 1}Score`;
    localStorage.setItem(scoreKey, score.toString());

    setStatus('success');
    if (audioRef.current) audioRef.current.pause();
    
    setTimeout(() => {
       onNext(config.next);
    }, 2000);
  }, [status, startTime, stage, config, onNext]);

  return {
    status,
    isExitingIntro,
    countdown,
    config,
    audioRef,
    startTest,
    handleHeard
  };
}

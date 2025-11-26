import { useState, useEffect, useRef, useCallback } from 'react';

const STAGE_CONFIG: Record<string, { title: string; description: string; next: string; keyword: string }> = {
  restaurant: {
    title: "Hear\nthe restaurant\nsounds",
    keyword: "restaurant",
    description: "A sound will play for about X seconds and will gradually get louder. Press the button as soon as you hear it.",
    next: "street"
  },
  street: {
    title: "Hear\nthe street\nsounds",
    keyword: "street",
    description: "A sound will play for about X seconds and will gradually get louder. Press the button as soon as you hear it.",
    next: "music"
  },
  music: {
    title: "Hear\nthe musical\nsounds",
    keyword: "musical",
    description: "A sound will play for about X seconds and will gradually get louder. Press the button as soon as you hear it.",
    next: "age-selection"
  }
};

const TEST_DURATION = 30000;

export function useTestLogic(stage: string, onNext: (next: string) => void) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<'intro' | 'countdown' | 'testing' | 'success'>('intro');
  const [countdown, setCountdown] = useState(3);
  const [startTime, setStartTime] = useState<number | null>(null);

  const config = STAGE_CONFIG[stage];

  useEffect(() => {
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
        const volume = Math.pow(progress, 2);
        audioRef.current.volume = volume;
        if (progress >= 1) handleHeard();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [status, startTime]);

  const startTest = useCallback(() => {
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
    const volumeAtClick = Math.pow(progress, 2) * 100;
    const score = Math.max(0, Math.round(100 - volumeAtClick));

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
    countdown,
    config,
    audioRef,
    startTest,
    handleHeard
  };
}

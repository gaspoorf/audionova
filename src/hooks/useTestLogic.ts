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
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const connectedElementRef = useRef<HTMLAudioElement | null>(null);

  const [status, setStatus] = useState<'intro' | 'countdown' | 'testing' | 'success'>('intro');
  const [isExitingIntro, setIsExitingIntro] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [startTime, setStartTime] = useState<number | null>(null);

  const config = STAGE_CONFIG[stage];

  // Initialize Audio Context (iOS Support)
  const initAudioContext = useCallback(() => {
    if (!audioRef.current) return;

    // 1. Create Context & Gain if needed
    if (!audioContextRef.current) {
        const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const gain = ctx.createGain();
        gain.connect(ctx.destination);
        
        audioContextRef.current = ctx;
        gainNodeRef.current = gain;
    }

    // 2. Resume Context (User Interaction)
    if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
    }

    // 3. Connect Source if new element
    if (audioRef.current !== connectedElementRef.current) {
        // Disconnect old source if any
        if (sourceNodeRef.current) {
            try { sourceNodeRef.current.disconnect(); } catch(e) {}
        }

        try {
            const source = audioContextRef.current.createMediaElementSource(audioRef.current);
            if (gainNodeRef.current) {
                source.connect(gainNodeRef.current);
            }
            sourceNodeRef.current = source;
            connectedElementRef.current = audioRef.current;
        } catch (e) {
            console.warn("Error connecting media source", e);
        }
    }
  }, []);

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
        
        // Power of 3 curve: smoother progression
        // Previous Power of 6 was too quiet for too long, then too loud too fast.
        // At 15s (50%), volume is ~12.5% (audible but soft)
        // At 25s (83%), volume is ~57% (loud but not instant max)
        const volume = 0.0001 + (Math.pow(progress, 3) * 0.9999);
        
        // Apply to GainNode (iOS)
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = Math.min(1, volume);
        }
        
        // Fallback/Sync
        audioRef.current.volume = Math.min(1, volume);
        
        if (progress >= 1) handleHeard();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [status, startTime]);

  const startTest = useCallback(() => {
    initAudioContext(); // Initialize Audio Context on user interaction

    // Trigger exit animation for intro elements
    setIsExitingIntro(true);

    // Wait for animation (500ms) before starting countdown
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
  }, [initAudioContext]);

  const beginAudio = () => {
    setStatus('testing');
    setStartTime(Date.now());
    if (audioRef.current) {
      audioRef.current.volume = 0;
      if (gainNodeRef.current) gainNodeRef.current.gain.value = 0;
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

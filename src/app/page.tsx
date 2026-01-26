"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import WelcomeView from '@/components/WelcomeView';
import InstructionsView from '@/components/InstructionsView';
import TestView from '@/components/TestView';
import AgeSelectionView from '@/components/AgeSelectionView';
import ResultView from '@/components/ResultView';
import UnifiedCircleButton, { CircleVariant } from '@/components/UnifiedCircleButton';
import LegalModal from '@/components/LegalModal';
import { useTestLogic } from '@/hooks/useTestLogic';
import styles from './page.module.scss'; // We'll create this

type ViewState = 
  | 'welcome' 
  | 'instructions' 
  | 'test-restaurant' 
  | 'test-street' 
  | 'test-music' 
  | 'age-selection' 
  | 'result';

export default function Home() {
  const [view, setView] = useState<ViewState>('welcome');
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  // Ambient Sound Logic
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientContextRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audio = new Audio('/sounds/effects/ambiant-sound.mp3');
    audio.loop = true;
    audio.volume = 0;
    ambientAudioRef.current = audio;

    // Initialize Web Audio API for iOS fading support
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    if (AudioContextClass) {
      const ctx = new AudioContextClass();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);
      
      const source = ctx.createMediaElementSource(audio);
      source.connect(gain);
      
      ambientContextRef.current = ctx;
      ambientGainRef.current = gain;
    }
    
    // Try to play immediately (might be blocked)
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      ambientAudioRef.current = null;
      if (ambientContextRef.current) {
        ambientContextRef.current.close();
        ambientContextRef.current = null;
      }
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  // Test Logic Hook (only active when in test mode)
  const currentTestStage = view.startsWith('test-') ? view.replace('test-', '') : 'restaurant';
  const { status: testStatus, isExitingIntro, countdown, config: testConfig, audioRef, startTest, handleHeard } = useTestLogic(
    currentTestStage,
    (next) => handleTestNext(next)
  );

  // Manage Ambient Sound Volume based on state
  useEffect(() => {
    const audio = ambientAudioRef.current;
    if (!audio) return;

    // Resume AudioContext on interaction (if suspended)
    if (ambientContextRef.current?.state === 'suspended') {
      ambientContextRef.current.resume();
    }

    let shouldPlay = true;
    // Stop during countdown and testing phases
    if (view.startsWith('test-') && (testStatus === 'countdown' || testStatus === 'testing')) {
      shouldPlay = false;
    }

    const targetVolume = shouldPlay ? 0.5 : 0;
    const duration = 1000;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    // If we want to play and it's paused, play it first
    if (targetVolume > 0 && audio.paused) {
      audio.play().catch(() => {});
    }

    // Get start volume from GainNode if available, else audio element
    const startVolume = ambientGainRef.current ? ambientGainRef.current.gain.value : audio.volume;
    const diff = targetVolume - startVolume;
    const steps = 20;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    
    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      let newVolume = startVolume + (diff * (currentStep / steps));
      
      // Clamp
      newVolume = Math.max(0, Math.min(1, newVolume));
      
      // Apply to GainNode (iOS)
      if (ambientGainRef.current) {
        ambientGainRef.current.gain.value = newVolume;
      }
      // Apply to Element (Fallback)
      audio.volume = newVolume;
      
      if (currentStep >= steps) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        if (targetVolume === 0) {
          audio.pause();
        }
      }
    }, stepTime);

  }, [view, testStatus]);

  const handleStart = () => {
    // Ensure AudioContext is running
    if (ambientContextRef.current?.state === 'suspended') {
      ambientContextRef.current.resume();
    }
    // Wait for button animation
    setTimeout(() => setView('instructions'), 500);
  };
  const handleReady = () => {
    // Wait for button animation
    setTimeout(() => setView('test-restaurant'), 500);
  };

  const handleTestNext = (nextStage: string) => {
    if (nextStage === 'street') setView('test-street');
    else if (nextStage === 'music') setView('test-music');
    else if (nextStage === 'age-selection') setView('age-selection');
    else if (nextStage === 'result') setView('result');
  };

  const handleTestBack = () => {
    if (view === 'test-restaurant') setView('instructions');
    else if (view === 'test-street') setView('test-restaurant');
    else if (view === 'test-music') setView('test-street');
  };

  const handleAgeBack = () => setView('test-music');
  const handleAgeSelection = () => setView('result');

  // Determine Circle Button State
  let circleVariant: CircleVariant = 'hidden';
  let circleLabel: React.ReactNode = '';
  let circleOnClick: (() => void) | undefined = undefined;
  let circleCountdown: number | undefined = undefined;
  let circleBackgroundImage: string | undefined = undefined;

  if (view === 'welcome') {
    circleVariant = 'default';
    circleLabel = <>Start</>;
    circleOnClick = handleStart;
  } else if (view === 'instructions') {
    circleVariant = 'default';
    circleLabel = "I'm ready";
    circleOnClick = handleReady;
  } else if (view.startsWith('test-')) {
    if (testStatus === 'intro') {
      circleVariant = 'default';
      circleLabel = <>Start</>;
      circleOnClick = startTest;
    } else if (testStatus === 'countdown') {
      circleVariant = 'countdown';
      circleCountdown = countdown;
    } else if (testStatus === 'testing') {
      circleVariant = 'testing';
      circleLabel = <>I hear<br/>the sound</>;
      circleOnClick = handleHeard;
      circleBackgroundImage = `/img/sounds/${currentTestStage}.webp`;
    } else if (testStatus === 'success') {
      circleVariant = 'success';
    }
  }

  // Determine Header State
  const isCompactHeader = view.startsWith('test-') || view === 'result';
  const showDecorations = ['welcome', 'instructions', 'result'].includes(view);

  return (
    <div className={styles.mainLayout}>
      {/* Ellipse Decorations */}
      <div className={`${styles.decorationsLayer} ${showDecorations ? styles.visible : ''}`}>
        <div className={styles.ellipseSmallWrapper}>
          <Image 
            src="/icons/Ellipse-small.svg" 
            alt="" 
            width={400} 
            height={400} 
            className={styles.ellipseSmall}
            priority
          />
        </div>
        <div className={styles.ellipseBigWrapper}>
          <Image 
            src="/icons/Ellipse-big.svg" 
            alt="" 
            width={800} 
            height={800} 
            className={styles.ellipseBig}
            priority
          />
        </div>
      </div>

      {/* Persistent Circle Button */}
      <div className={`${styles.circleContainer} ${styles.bottom}`}>
        <UnifiedCircleButton 
          variant={circleVariant}
          label={circleLabel}
          onClick={circleOnClick}
          countdownValue={circleCountdown}
          backgroundImage={circleBackgroundImage}
        />

        {/* Footer Links (Relative to Circle) */}
        <div className={styles.relativeFooter}>
          {(view.startsWith('test-') || view === 'age-selection') && (
            <button 
              className={styles.backButton} 
              onClick={view === 'age-selection' ? handleAgeBack : handleTestBack}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
          )}

          {view !== 'result' && (
            <a 
              href="#" 
              className={styles.legalLink}
              onClick={(e) => {
                e.preventDefault();
                setIsLegalOpen(true);
              }}
            >
              LEGAL
            </a>
          )}
        </div>
      </div>

      {/* Content Views (Buttonless) */}
      <div className={`${styles.contentLayer} ${(view === 'age-selection' || view === 'result') ? styles.interactive : ''}`}>
        {view === 'welcome' && <WelcomeView buttonless />}
        
        {view === 'instructions' && <InstructionsView onReady={handleReady} buttonless />}
        
        {view.startsWith('test-') && (
          <TestView 
            stage={currentTestStage} 
            status={testStatus} // Pass status from hook
            isExitingIntro={isExitingIntro}
            config={testConfig} // Pass config from hook
            audioRef={audioRef} // Pass ref from hook
            onBack={handleTestBack} 
            buttonless // Tell TestView not to render its own button
          />
        )}
        
        {view === 'age-selection' && (
          <AgeSelectionView 
            onSelect={handleAgeSelection} 
            onBack={handleAgeBack}
          />
        )}
        
        {view === 'result' && <ResultView onLegalClick={() => setIsLegalOpen(true)} />}
      </div>

      <LegalModal 
        isOpen={isLegalOpen} 
        onClose={() => setIsLegalOpen(false)} 
      />
    </div>
  );
}


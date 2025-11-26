"use client";

import { useState } from 'react';
import WelcomeView from '@/components/WelcomeView';
import InstructionsView from '@/components/InstructionsView';
import TestView from '@/components/TestView';
import AgeSelectionView from '@/components/AgeSelectionView';
import ResultView from '@/components/ResultView';
import UnifiedCircleButton, { CircleVariant } from '@/components/UnifiedCircleButton';
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

  // Test Logic Hook (only active when in test mode)
  const currentTestStage = view.startsWith('test-') ? view.replace('test-', '') : 'restaurant';
  const { status: testStatus, countdown, config: testConfig, audioRef, startTest, handleHeard } = useTestLogic(
    currentTestStage,
    (next) => handleTestNext(next)
  );

  const handleStart = () => setView('instructions');
  const handleReady = () => setView('test-restaurant');

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

  if (view === 'welcome') {
    circleVariant = 'default';
    circleLabel = <>Start<br />the test</>;
    circleOnClick = handleStart;
  } else if (view === 'instructions') {
    circleVariant = 'default';
    circleLabel = "I'm ready";
    circleOnClick = handleReady;
  } else if (view.startsWith('test-')) {
    if (testStatus === 'intro') {
      circleVariant = 'default';
      circleLabel = <>Start<br />the test</>;
      circleOnClick = startTest;
    } else if (testStatus === 'countdown') {
      circleVariant = 'countdown';
      circleCountdown = countdown;
    } else if (testStatus === 'testing') {
      circleVariant = 'testing';
      circleLabel = <>I heard<br />the sound</>;
      circleOnClick = handleHeard;
    } else if (testStatus === 'success') {
      circleVariant = 'success';
    }
  }

  return (
    <div className={styles.mainLayout}>
      {/* Background Pattern */}
      <div className={styles.backgroundLayer}>
        <svg viewBox="0 0 375 812" preserveAspectRatio="xMidYMid slice">
          <circle cx="50%" cy="40%" r="100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="50%" cy="40%" r="180" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="50%" cy="40%" r="280" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="50%" cy="40%" r="400" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="50%" cy="40%" r="550" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-100 600 Q 187 500 475 600" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
          <path d="M-100 650 Q 187 550 475 650" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Persistent Circle Button */}
      <div className={`${styles.circleContainer} ${view.startsWith('test-') ? styles.center : styles.bottom}`}>
        <UnifiedCircleButton 
          variant={circleVariant}
          label={circleLabel}
          onClick={circleOnClick}
          countdownValue={circleCountdown}
        />
      </div>

      {/* Content Views (Buttonless) */}
      <div className={styles.contentLayer}>
        {view === 'welcome' && <WelcomeView buttonless />}
        
        {view === 'instructions' && <InstructionsView onReady={handleReady} buttonless />}
        
        {view.startsWith('test-') && (
          <TestView 
            stage={currentTestStage} 
            status={testStatus} // Pass status from hook
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
        
        {view === 'result' && <ResultView />}
      </div>
    </div>
  );
}


"use client";

import { useState } from 'react';
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

  // Test Logic Hook (only active when in test mode)
  const currentTestStage = view.startsWith('test-') ? view.replace('test-', '') : 'restaurant';
  const { status: testStatus, isExitingIntro, countdown, config: testConfig, audioRef, startTest, handleHeard } = useTestLogic(
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
  let circleBackgroundImage: string | undefined = undefined;

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
      circleBackgroundImage = `/img/sounds/${currentTestStage}.jpg`;
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
      </div>

      {/* Content Views (Buttonless) */}
      <div className={styles.contentLayer}>
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
        
        {view === 'result' && <ResultView />}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
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
        </div>
      </footer>

      <LegalModal 
        isOpen={isLegalOpen} 
        onClose={() => setIsLegalOpen(false)} 
      />
    </div>
  );
}


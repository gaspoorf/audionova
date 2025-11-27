import { RefObject } from 'react';
import styles from './TestView.module.scss';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

const STAGES = ['restaurant', 'street', 'music'];

interface TestViewProps {
  stage: string;
  status: 'intro' | 'countdown' | 'testing' | 'success';
  isExitingIntro?: boolean;
  config: { title: string; description: string; next: string; keyword: string };
  audioRef: RefObject<HTMLAudioElement | null>;
  onBack: () => void;
  buttonless?: boolean;
  onNext?: (next: string) => void;
}

export default function TestView({ stage, status, isExitingIntro, config, audioRef, onBack, buttonless }: TestViewProps) {
  const stageIndex = STAGES.indexOf(stage) + 1;

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
      <Header compact />
      <ProgressBar current={stageIndex} total={3} />
      
      <audio ref={audioRef} src={`/sounds/${stage}.mp3`} loop />

      <h1 key={`${stage}-title`} className={`${styles.title} animate-fade-in`}>{renderTitle()}</h1>

      {(status === 'intro' || isExitingIntro) && (
        <>
          <p 
            key={`${stage}-desc`} 
            className={`${styles.description} ${isExitingIntro ? 'animate-fade-out' : 'animate-fade-in'}`}
          >
            {config.description}
          </p>
          {!buttonless && (
             <div className={`${styles.buttonWrapper} ${isExitingIntro ? 'animate-fade-out' : 'animate-fade-in'}`}>
               <button className={styles.circleButton}>Start</button>
             </div>
          )}
        </>
      )}
      
    </main>
  );
}

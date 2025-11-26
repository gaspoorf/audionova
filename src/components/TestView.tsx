import { RefObject } from 'react';
import styles from './TestView.module.scss';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

const STAGES = ['restaurant', 'street', 'music'];

interface TestViewProps {
  stage: string;
  status: 'intro' | 'countdown' | 'testing' | 'success';
  config: { title: string; description: string; next: string; keyword: string };
  audioRef: RefObject<HTMLAudioElement | null>;
  onBack: () => void;
  buttonless?: boolean;
  onNext?: (next: string) => void;
}

export default function TestView({ stage, status, config, audioRef, onBack, buttonless }: TestViewProps) {
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
      <button className={styles.topBackButton} onClick={onBack}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>
      <Header />
      {status !== 'success' && <ProgressBar current={stageIndex} total={3} />}
      
      <audio ref={audioRef} src={`/sounds/${stage}.mp3`} loop />

      <h1 className={styles.title}>{renderTitle()}</h1>

      {(status === 'intro' || status === 'testing') && (
        <>
          <p className={styles.description}>{config.description}</p>
          {!buttonless && (
             <div className={styles.buttonWrapper}>
               <button className={styles.circleButton}>Start</button>
             </div>
          )}
        </>
      )}
      
    </main>
  );
}

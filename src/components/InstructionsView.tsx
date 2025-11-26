import Image from 'next/image';
import styles from './InstructionsView.module.scss';
import Header from '@/components/Header';

interface InstructionsViewProps {
  onReady?: () => void;
  buttonless?: boolean;
}

export default function InstructionsView({ onReady, buttonless }: InstructionsViewProps) {
  return (
    <main className={styles.container}>
      <Header />
      
      <h1 className={styles.title}>Before you start</h1>
      
      <div className={styles.instructionList}>
        <div className={styles.instructionItem}>
          <div className={styles.iconWrapper}>
            <Image 
              src="/icons/quiet-place.svg" 
              alt="Quiet place" 
              width={48} 
              height={48} 
            />
          </div>
          <p>Find a quiet place</p>
        </div>
        <div className={styles.instructionItem}>
          <div className={styles.iconWrapper}>
            <Image 
              src="/icons/headphones.svg" 
              alt="Headphones" 
              width={48} 
              height={48} 
            />
          </div>
          <p>Use headphones</p>
        </div>
        <div className={styles.instructionItem}>
          <div className={styles.iconWrapper}>
            <Image 
              src="/icons/volume.svg" 
              alt="Volume" 
              width={48} 
              height={48} 
            />
          </div>
          <p>Set your device volume<br />to 100%</p>
        </div>
      </div>
      {!buttonless && (
        <div className={styles.buttonWrapper}>
          <button className={styles.button} onClick={onReady}>
            I'm ready
          </button>
        </div>
      )}
    </main>
  );
}

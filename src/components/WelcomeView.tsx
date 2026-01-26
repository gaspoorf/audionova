import styles from './WelcomeView.module.scss';
import Header from '@/components/Header';

interface WelcomeViewProps {
  onStart?: () => void;
  buttonless?: boolean;
}

export default function WelcomeView({ onStart, buttonless }: WelcomeViewProps) {
  return (
    <main className={`${styles.container} animate-fade-in`}>
      <Header />
      
      <div className={styles.content}>
        <h1 className={styles.title}>
          Your hearing<br />matters
        </h1>
        <p className={styles.description}>
          <strong>3 quick steps</strong> to see how your hearing is doing
        </p>
        
        <div className={styles.ctaText}>Check it today</div>
      </div>

      {!buttonless && (
        <div className={styles.buttonWrapper}>
          <button className={styles.button} onClick={onStart}>
            Start
          </button>
        </div>
      )}
    </main>
  );
}

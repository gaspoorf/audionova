import styles from './WelcomeView.module.scss';
import Header from '@/components/Header';

interface WelcomeViewProps {
  onStart?: () => void;
  buttonless?: boolean;
}

export default function WelcomeView({ onStart, buttonless }: WelcomeViewProps) {
  return (
    <main className={styles.container}>
      <Header />
      
      <div className={styles.content}>
        <h1 className={styles.title}>
          Your hearing<br />matters
        </h1>
        <p className={styles.description}>
          <strong>3 quick steps</strong> to estimate<br />your current hearing level
        </p>
        
        <div className={styles.ctaText}>Check it today</div>
      </div>

      {!buttonless && (
        <div className={styles.buttonWrapper}>
          <button className={styles.button} onClick={onStart}>
            Start<br />the test
          </button>
        </div>
      )}
    </main>
  );
}

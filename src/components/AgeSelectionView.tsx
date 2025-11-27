import styles from './AgeSelectionView.module.scss';
import Header from '@/components/Header';

interface AgeSelectionViewProps {
  onSelect: (ageGroup: string) => void;
  onBack: () => void;
}

export default function AgeSelectionView({ onSelect, onBack }: AgeSelectionViewProps) {
  const handleSelection = (ageGroup: string) => {
    localStorage.setItem('ageGroup', ageGroup);
    onSelect(ageGroup);
  };

  return (
    <main className={`${styles.container} animate-fade-in`}>
      <Header />
      
      <div className={styles.label}>ONE MORE THING</div>
      <h1 className={styles.title}>
        For a more <strong>personalized result,</strong> please select your age group
      </h1>
      
      <div className={styles.buttonGroup}>
        <button 
          className={styles.button}
          onClick={() => handleSelection('under-50')}
        >
          Under 50
        </button>
        <button 
          className={styles.button}
          onClick={() => handleSelection('51-70')}
        >
          51-70
        </button>
        <button 
          className={styles.button}
          onClick={() => handleSelection('70+')}
        >
          70+
        </button>
      </div>
    </main>
  );
}

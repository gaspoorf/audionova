import { ReactNode } from 'react';
import styles from './UnifiedCircleButton.module.scss';

export type CircleVariant = 'default' | 'countdown' | 'testing' | 'success' | 'hidden';

interface UnifiedCircleButtonProps {
  variant: CircleVariant;
  onClick?: () => void;
  label?: ReactNode;
  subLabel?: string;
  backgroundImage?: string;
  countdownValue?: number;
  disabled?: boolean;
  className?: string;
}

export default function UnifiedCircleButton({
  variant,
  onClick,
  label,
  subLabel,
  backgroundImage,
  countdownValue,
  disabled,
  className = ''
}: UnifiedCircleButtonProps) {
  
  return (
    <div className={`${styles.wrapper} ${styles[variant]} ${className}`}>
      {/* Pulse Rings (Only for default/intro state) */}
      {variant === 'default' && (
        <>
          <div className={styles.pulseCircle1}></div>
          <div className={styles.pulseCircle2}></div>
          <div className={styles.pulseCircle3}></div>
        </>
      )}

      {/* Success Ripples */}
      {variant === 'success' && (
        <>
          <div className={styles.successRipple1}></div>
          <div className={styles.successRipple2}></div>
          <div className={styles.successRipple3}></div>
        </>
      )}

      <button 
        className={`${styles.button} ${styles[variant]}`}
        onClick={onClick}
        disabled={disabled || variant === 'countdown' || variant === 'success'}
      >
        {/* Testing Mode - Simplified */}
        {variant === 'testing' && (
           <div className={styles.overlay}>
             {label && <span className={styles.overlayText}>{label}</span>}
           </div>
        )}

        {/* Content for Default Mode */}
        {variant === 'default' && (
          <span className={styles.buttonText}>{label}</span>
        )}

        {/* Content for Countdown Mode */}
        {variant === 'countdown' && (
          <div className={styles.countdownContainer}>
            <svg className={styles.countdownSvg} viewBox="0 0 100 100">
              <circle className={styles.countdownCircleBackground} cx="50" cy="50" r="48" />
              <circle className={styles.countdownCircleProgress} cx="50" cy="50" r="48" />
            </svg>
            <div className={styles.countdownValue}>{countdownValue}</div>
          </div>
        )}

        {/* Content for Success Mode */}
        {variant === 'success' && (
          <div className={styles.successIcon}>✓</div>
        )}
      </button>
    </div>
  );
}

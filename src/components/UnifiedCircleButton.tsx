import { ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleInteraction = () => {
    if (!onClick) return;

    // Play click sound
    const clickSound = new Audio('/sounds/effects/clic.mp3');
    clickSound.play().catch(() => {}); // Ignore auto-play errors
    
    // Only animate exit for default variant (pulse circles)
    if (variant === 'default') {
      setIsExiting(true);
      setTimeout(() => {
        onClick();
        setIsExiting(false);
      }, 500); // Match CSS duration
    } else {
      onClick();
    }
  };

  useEffect(() => {
    if (variant !== 'testing' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (large enough to hold the ripples)
    // We use a fixed large size to match the CSS 150vmax roughly, or dynamic
    // For simplicity and performance, let's use a fixed large resolution
    canvas.width = 2000;
    canvas.height = 2000;

    let animationFrameId: number;
    const ripples: { age: number; id: number }[] = [];
    
    // Natural Spawn Logic
    let lastSpawnTime = 0;
    let nextSpawnDelay = 0;

    // Helper to generate next delay
    // Irregular intervals between groups
    const getNextGroupDelay = () => {
      // return 2500 + Math.random() * 2000;
      return 2000 + Math.random() * 500; // Faster: 1s to 2.2s between groups
    };

    const render = (time: number) => {
      if (time - lastSpawnTime > nextSpawnDelay) {
        // Spawn a group of 2 or 3 ripples
        const count = Math.floor(Math.random() * 2) + 2; // 2 or 3
        
        for (let k = 0; k < count; k++) {
            // Stagger them slightly (300ms - 600ms apart)
            const stagger = k * (300 + Math.random() * 300);
            ripples.push({ age: -stagger, id: time + k }); 
        }

        lastSpawnTime = time;
        nextSpawnDelay = getNextGroupDelay();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Base Oval Dimensions (Taller than wide, tilted)
      const baseRadiusX = 220; 
      const baseRadiusY = 300;
      const rotation = -20 * (Math.PI / 180); // Same tilt as ripples

      // --- DRAW HALO (Organic Blob) ---
      ctx.save();
      
      // Use "Offset Shadow" technique to create a pure blur that works on all devices (including iOS)
      // We draw the shape far off-screen, and cast a blurred shadow back onto the screen.
      // This eliminates the hard edge of the fill and creates a perfect soft glow.
      const shadowOffset = 10000;
      ctx.translate(-shadowOffset, 0);
      ctx.shadowOffsetX = shadowOffset;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 80; // High blur for soft "faded" look
      ctx.shadowColor = 'rgba(94, 244, 128, 0.5)'; // Adjust opacity for "bien fondu"
      ctx.fillStyle = 'rgba(94, 244, 128, 1)'; // Solid fill off-screen to cast strong shadow
      
      ctx.beginPath();
      const haloPoints = 12; // More points for smoother oval shape

      // Simulate speech reaction (fast, irregular pulsing)
      // Combine multiple sine waves of different high frequencies
      // Slowed down further (approx 50% of original speed)
      const speechPulse = (
        Math.sin(time * 0.004) * 0.5 + 
        Math.sin(time * 0.010) * 0.3 + 
        Math.sin(time * 0.020) * 0.2
      ); 
      // Result varies between approx -1 and 1, changing quickly
      
      // Apply pulse to overall size (breathing + talking)
      const currentScale = 1 + (speechPulse * 0.15); // +/- 15% size variation

      const haloPointsArr = [];

      for (let i = 0; i < haloPoints; i++) {
        const angle = (Math.PI * 2 * i) / haloPoints;
        
        // Organic surface deformation (wobble)
        // Slowed down further
        const wobble = Math.sin(time * 0.0015 + i * 2) * 20 + Math.cos(time * 0.0025 + i * 3) * 20;
        
        // Calculate point on unrotated oval
        const rX = (baseRadiusX * currentScale) + wobble;
        const rY = (baseRadiusY * currentScale) + wobble;
        
        const unrotatedX = Math.cos(angle) * rX;
        const unrotatedY = Math.sin(angle) * rY;

        // Apply rotation
        const rotatedX = unrotatedX * Math.cos(rotation) - unrotatedY * Math.sin(rotation);
        const rotatedY = unrotatedX * Math.sin(rotation) + unrotatedY * Math.cos(rotation);

        haloPointsArr.push({
            x: centerX + rotatedX,
            y: centerY + rotatedY
        });
      }

      // Draw smooth curve through points
      if (haloPointsArr.length > 0) {
        const pLast = haloPointsArr[haloPointsArr.length - 1];
        const p0 = haloPointsArr[0];
        // Start from midpoint between last and first
        const midX = (pLast.x + p0.x) / 2;
        const midY = (pLast.y + p0.y) / 2;
        ctx.moveTo(midX, midY);

        for (let i = 0; i < haloPointsArr.length; i++) {
            const p1 = haloPointsArr[i];
            const p2 = haloPointsArr[(i + 1) % haloPointsArr.length];
            const midPointX = (p1.x + p2.x) / 2;
            const midPointY = (p1.y + p2.y) / 2;
            ctx.quadraticCurveTo(p1.x, p1.y, midPointX, midPointY);
        }
      }
      ctx.fill();
      ctx.restore();

      // Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.age += 16; // Assume ~60fps

        if (ripple.age < 0) continue; // Wait for start

        const maxAge = 7000; // Slower expansion
        const progress = ripple.age / maxAge;

        if (progress >= 1) {
          ripples.splice(i, 1);
          continue;
        }

        // Animation Logic
        // Start as circle (radius 120px matching button)
        // End as large tilted oval (organic deformation)
        // Scaled up for larger canvas
        const startRadius = 120; 
        const endRadiusX = 600; 
        const endRadiusY = 900; 
        const rotation = -20 * (Math.PI / 180); // Tilted ~20 degrees left

        // Easing: Quint Out (Fast start, very slow end)
        const ease = 1 - Math.pow(1 - progress, 5);

        const currentRadiusX = startRadius + (endRadiusX - startRadius) * ease;
        const currentRadiusY = startRadius + (endRadiusY - startRadius) * ease;
        
        // Slight upward drift to "take the top of the screen"
        const currentCy = centerY - (150 * ease);

        // Opacity: Fade out faster to avoid "piling up" at the end
        // Reduced base opacity to 0.5 for a lighter feel
        const opacity = 0.5 * Math.pow(1 - progress, 2.5);

        ctx.beginPath();
        ctx.ellipse(centerX, currentCy, currentRadiusX, currentRadiusY, rotation, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(94, 244, 128, ${opacity})`; // Spring green
        ctx.lineWidth = 2; // Slightly thicker
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant]);
  
  return (
    <div className={`${styles.wrapper} ${styles[variant]} ${className}`}>
      {/* Pulse Rings (Only for default/intro state) */}
      {variant === 'default' && (
        <div key={String(label)}>
          <div className={`${styles.pulseCircle1} ${isExiting ? styles.exiting : ''}`}></div>
          <div className={`${styles.pulseCircle2} ${isExiting ? styles.exiting : ''}`}></div>
        </div>
      )}

      {/* Testing Ripples (Canvas) */}
      {variant === 'testing' && (
        <canvas ref={canvasRef} className={styles.rippleCanvas} />
      )}

      {/* Success Ripples */}
      {variant === 'success' && (
        <>
          <div className={styles.successRipple1}></div>
          <div className={styles.successRipple2}></div>
        </>
      )}

      <button 
        className={`${styles.button} ${styles[variant]} ${isExiting ? styles.buttonExiting : ''}`}
        onClick={handleInteraction}
        disabled={disabled || variant === 'countdown' || variant === 'success'}
        style={variant === 'testing' && backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {/* Testing Mode - Simplified */}
        {variant === 'testing' && (
           <div className={styles.overlay}>
             <svg className={styles.testingProgressSvg} viewBox="0 0 100 100">
               <circle className={styles.testingCircleBackground} cx="50" cy="50" r="48" />
               <circle className={styles.testingCircleProgress} cx="50" cy="50" r="48" />
             </svg>
             <div className={styles.innerWhiteCircle}>
               {label && <span className={styles.overlayText}>{label}</span>}
             </div>
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
              <circle 
                key={countdownValue} 
                className={styles.countdownCircleProgress} 
                cx="50" 
                cy="50" 
                r="48" 
              />
            </svg>
            <div key={countdownValue} className={styles.countdownValue}>{countdownValue}</div>
          </div>
        )}

        {/* Content for Success Mode */}
        {variant === 'success' && (
          <div className={styles.successIcon}>
            <Image 
                src="/icons/icon-check.svg" 
                alt="icon-validation" 
                width={41} 
                height={37} 
            />
          </div>
        )}
      </button>
    </div>
  );
}

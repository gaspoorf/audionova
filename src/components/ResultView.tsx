import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './ResultView.module.scss';
import Header from '@/components/Header';

gsap.registerPlugin(useGSAP);

interface ResultViewProps {
  onLegalClick: () => void;
}

export default function ResultView({ onLegalClick }: ResultViewProps) {
  const [score, setScore] = useState<number | null>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s1 = Number(localStorage.getItem('sound1Score') || 0);
    const s2 = Number(localStorage.getItem('sound2Score') || 0);
    const s3 = Number(localStorage.getItem('sound3Score') || 0);

    // Calculate average (0-100)
    const finalScore = Math.round((s1 + s2 + s3) / 3);
    setScore(finalScore);
  }, []);

  // Map 0-100 score to 1-5 scale
  // 0-20: 1, 21-40: 2, 41-60: 3, 61-80: 4, 81-100: 5
  const scoreLevel = score === null ? 1 : Math.min(5, Math.max(1, Math.ceil(score / 20)));

  // Title logic
  const getTitle = () => {
    switch (scoreLevel) {
      case 1: return <>Your hearing is quite<span>limited</span></>;
      case 2: return <>You have a <span>below-average</span> hearing sensitivity</>;
      case 3: return <>Your have an <span>average</span> hearing sensitivity</>;
      case 4: return <>You have <span>above-average</span> hearing sensitivity</>;
      case 5: return <>You have <span>excellent</span> hearing sensitivity</>;
      default: return <>Error</>;
    }
  };

  // Rotation for the needle (center of each segment)
  // Segments are 36 degrees each (180 / 5)
  // Centers: 18, 54, 90, 126, 162 degrees from left
  // CSS rotation is -90 (left) to 90 (right)
  // So: -72, -36, 0, 36, 72
  const rotations = [-72, -36, 0, 36, 72];
  const rotation = rotations[scoreLevel - 1];

  useGSAP(() => {
    if (score === null || !spotlightRef.current) return;

    // Kill any existing tweens
    gsap.killTweensOf(spotlightRef.current);

    const tl = gsap.timeline();

    // Initial state
    gsap.set(spotlightRef.current, {
      xPercent: -50,
      rotate: rotation, // Start from far left
      background: 'linear-gradient(to bottom, rgba(94, 244, 128, 0) 100%, rgba(94, 244, 128, 0.5) 100%)'
    });

    // Animation sequence
    tl.to(spotlightRef.current, {
      background: 'linear-gradient(to bottom, rgba(94, 244, 128, 0) 0%, rgba(94, 244, 128, 0.5) 100%)',
      duration: 1.5,
      ease: 'power2.inOut'
    })

  }, [rotation, score]);

  if (score === null) return <div>Loading...</div>;

  // SVG paths for each segment (from left to right)
  const segments = [
    {
      // Segment 1 (Leftmost)
      path: "M37.2481 8.85355C38.5846 9.83272 38.8701 11.7077 37.9308 13.0725C26.8782 29.1296 20.658 48.0203 20.0081 67.5028C19.9528 69.1587 18.6091 70.4972 16.9523 70.4907L2.95223 70.436C1.29535 70.4296 -0.0464082 69.0805 0.000845041 67.4243C0.677217 43.7175 8.24984 20.7189 21.7909 1.24818C22.7369 -0.112099 24.6177 -0.400001 25.9543 0.579231L37.2481 8.85355Z",
      viewBox: "0 0 39 71",
      width: 39,
      height: 71,
      x: 28,
      y: 78
    },
    {
      // Segment 2
      path: "M1.23521 43.3732C-0.106669 42.4013 -0.408576 40.5218 0.594673 39.2032C14.8325 20.4904 32.6866 7.94033 54.8959 0.164927C56.4597 -0.382557 58.1563 0.480061 58.6706 2.0551L63.0162 15.3631C63.5305 16.9381 62.6672 18.6286 61.1053 19.1814C42.9356 25.6124 28.5253 35.6678 16.7981 50.9384C15.789 52.2524 13.9156 52.5572 12.5737 51.5853L1.23521 43.3732Z",
      viewBox: "0 0 64 53",
      width: 64,
      height: 53,
      x: 54,
      y: 33
    },
    {
      // Segment 3 (Center)
      path: "M0.158571 8.71036C-0.378415 7.12308 0.491341 5.39931 2.09699 4.92002C24.3827 -1.73229 43.4399 -1.63679 65.6721 5.19511C67.2743 5.68747 68.1303 7.41886 67.5799 9.00207L63.2782 21.3763C62.7469 22.9046 61.1003 23.7314 59.5413 23.2982C42.7918 18.6442 24.8685 18.5667 8.07625 23.0739C6.51404 23.4932 4.87536 22.6528 4.35701 21.1206L0.158571 8.71036Z",
      viewBox: "0 0 68 24",
      width: 68,
      height: 24,
      x: 116,
      y: 25
    },
    {
      // Segment 4
      path: "M61.9298 43.3732C63.2717 42.4013 63.5736 40.5218 62.5704 39.2032C48.3326 20.4904 30.4785 7.94033 8.26914 0.164927C6.70532 -0.382557 5.00876 0.480061 4.49445 2.0551L0.14882 15.3631C-0.365474 16.9381 0.497837 18.6286 2.05971 19.1814C20.2294 25.6124 34.6398 35.6678 46.3669 50.9384C47.3761 52.2524 49.2495 52.5572 50.5913 51.5853L61.9298 43.3732Z",
      viewBox: "0 0 64 53",
      width: 64,
      height: 53,
      x: 182,
      y: 33
    },
    {
      // Segment 5 (Rightmost)
      path: "M12.5474 0.575693C13.8859 -0.400861 15.7666 -0.108819 16.7088 1.254C30.1398 20.6793 36.8136 42.8349 37.3759 66.4699C37.4153 68.1263 36.0713 69.4732 34.4144 69.4765L20.4149 69.5042C18.7581 69.5074 17.4164 68.1657 17.3709 66.5095C16.8381 47.1118 11.4821 29.0411 0.545865 13.0467C-0.389313 11.679 -0.100833 9.80389 1.23764 8.82734L12.5474 0.575693Z",
      viewBox: "0 0 38 70",
      width: 38,
      height: 70,
      x: 233,
      y: 78
    }
  ];

  return (
    <main className={`${styles.container} animate-fade-in`}>
      <Header compact />
      <h1 className={styles.title}>{getTitle()}</h1>
      
      <div className={styles.resultGraph}>
        <div className={styles.gaugeContainer}>
          <div className={styles.averageLabel}>
            <p>Average</p>
          </div>
          <svg className={styles.gaugeSvg} viewBox="0 0 300 160">
            {segments.map((seg, i) => {
              const isActive = i < scoreLevel;
              return (
                <svg 
                  key={i} 
                  x={seg.x} 
                  y={seg.y} 
                  width={seg.width} 
                  height={seg.height} 
                  viewBox={seg.viewBox}
                  overflow="visible"
                >
                  <path 
                    d={seg.path} 
                    className={isActive ? styles.activeSegment : styles.inactiveSegment}
                  />
                </svg>
              );
            })}
          </svg>
          
          {/* Needle / Spotlight */}
          <div 
            ref={spotlightRef}
            className={styles.spotlight} 
          />
          
          <div className={styles.resultLabel}>Your result</div>
        </div>
      </div>

      {scoreLevel <= 3 && (
        <button className={styles.button} onClick={() => window.open('https://www.audionova.com', '_blank')}>
          Get a full hearing check
        </button>
      )}
      
      <button className={styles.inviteLink}>
        Invite someone to try the test
        <Image 
          src="/icons/arrow-top-right.svg" 
          alt="" 
          width={16} 
          height={16} 
        />
      </button>

      {scoreLevel < 3 ? (
        <div className={styles.card}>
          <div className={styles.cardLabel}>RECOMMENDED FOR YOU</div>
          <h2 className={styles.cardTitle}>Phonak Virto™ R Infinio</h2>
          <div className={styles.productImage}>
            <Image 
              src="/icons/elipse.svg" 
              alt="" 
              width={250} 
              height={100} 
              className={styles.ringBack}
            />
            <Image 
              src="/img/products/phonak.webp" 
              alt="Phonak Virto™ R Infinio" 
              width={140} 
              height={140} 
              className={styles.productImg}
            />
            <Image 
              src="/icons/half-elipse.svg" 
              alt="" 
              width={250} 
              height={100} 
              className={styles.ringFront}
            />
          </div>
          <button className={styles.outlineButton}>Discover the product</button>
        </div>
      ) : (
        <div className={`${styles.card} ${styles.articleCard}`}>
          <div className={styles.articleImageContainer}>
            <Image 
              src="/img/articles/article-1.webp" 
              alt="Protect Your Hearing" 
              width={320} 
              height={200} 
              className={styles.articleImage}
            />
          </div>
          <div className={styles.articleContent}>
            <div className={styles.cardLabel}>RECOMMENDED FOR YOU</div>
            <h2 className={styles.cardTitle}>Protect Your Hearing</h2>
            <p className={styles.articleDescription}>
              Empower yourself with hearing loss prevention tips from AudioNova to enjoy a life full of sound.
            </p>
            <button className={styles.outlineButton} onClick={() => window.open('https://www.audionova.com/blog', '_blank')}>
              Read the article
            </button>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardLabel}>NEED ASSISTANCE?</div>
        <h2 className={styles.cardTitle}>Meet our hearing care specialists</h2>
        <div className={styles.contactList}>
          <div className={styles.contactItem}>
            <Image src="/icons/location.svg" alt="" width={24} height={24} />
            <a href="#">
              Find a center
            </a>
          </div>
          <div className={styles.contactItem}>
            <Image src="/icons/call.svg" alt="" width={24} height={24} />
            <a href="tel:0801907966">
              0 801 907 966
            </a>
          </div>
          <div className={styles.contactItem}>
            <Image src="/icons/email.svg" alt="" width={24} height={24} />
            <a href="mailto:crc@auditionsante.fr">
              crc@auditionsante.fr
            </a>
          </div>
        </div>
      </div>

      <button className={styles.legalButton} onClick={onLegalClick}>
        LEGAL
      </button>
    </main>
  );
}

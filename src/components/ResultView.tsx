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

  // Map 0-100 score to 1-3 scale
  // 0-33: 1, 34-66: 2, 67-100: 3
  const scoreLevel = score === null ? 1 : Math.min(3, Math.max(1, Math.ceil(score / 33.33)));

  // Title logic
  const getTitle = () => {
    switch (scoreLevel) {
      case 1: return <>Your hearing may be <span>reduced</span></>;
      case 2: return <>Your hearing may need a <span>closer check</span></>;
      case 3: return <>Your hearing looks <span>excellent</span></>;
      default: return <>Error</>;
    }
  };

  // Rotation for the needle (center of each segment)
  // 3 segments, 60 degrees each (approx)
  // Centers: -60, 0, 60
  const rotations = [-51, 0, 53];
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

  const segmentPath = "M63.2832 102.506C65.4923 102.506 67.2901 100.715 67.2169 98.507C66.566 78.8784 61.1315 59.683 51.3594 42.6011C41.5873 25.5193 27.7952 11.1053 11.2048 0.595384C9.3387 -0.586799 6.8833 0.054879 5.76353 1.95912L0.553065 10.8199C-0.56677 12.7242 0.0741755 15.1693 1.93339 16.3625C15.7824 25.2512 27.3023 37.3603 35.4932 51.6782C43.684 65.9962 48.2838 82.0637 48.9267 98.5071C49.013 100.715 50.7957 102.506 53.0049 102.506L63.2832 102.506Z";

  const segmentTransforms = [
    "rotate(-120, 150, 130) translate(207, 27.5)", // Left
    "rotate(-60, 150, 130) translate(207, 27.5)",  // Middle
    "translate(207, 27.5)"                         // Right
  ];

  const handleShare = () => {
    const shareMessages = [
      "Check what you hear. Explore your hearing with AudioNova.",
      "Can you hear it? Explore your hearing with AudioNova.",
      "Got 30 seconds? Explore your hearing with AudioNova."
    ];
    const randomMessage = shareMessages[Math.floor(Math.random() * shareMessages.length)];

    if (navigator.share) {
      navigator.share({
        title: 'Audionova',
        text: randomMessage,
        url: 'https://audionova-v1.vercel.app/',
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.fadeIn}>
        <Header compact />
        <h1 className={styles.title}>{getTitle()}</h1>
        
      </div>

      <div className={styles.desktopGrid}>
        {/* Column 1: Result & Actions */}
        <div className={`${styles.card} ${styles.resultCard} ${styles.fadeIn}`} style={{ animationDelay: '0.1s' }}>
          <div className={styles.resultGraph}>
            <div className={styles.gaugeContainer}>
      
              <svg className={styles.gaugeSvg} viewBox="0 0 300 160">
                {segmentTransforms.map((transform, i) => {
                  const isActive = i < scoreLevel;
                  return (
                    <path 
                      key={i} 
                      d={segmentPath} 
                      transform={transform}
                      className={`${styles.segment} ${isActive ? styles[`activeSegment${i}`] : styles.inactiveSegment}`}
                    />
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

          <div className={styles.resultActions}>
            {scoreLevel === 1 && (
              <button className={styles.button} onClick={() => window.open('https://www.audionova.com', '_blank')}>
                Book a free hearing test
              </button>
            )}
            {scoreLevel === 2 && (
              <button className={styles.button} onClick={() => window.open('https://hearing-screener.beyondhearing.org/aLXvXz/welcome', '_blank')}>
                Check your hearing
              </button>
            )}
            
            <button className={styles.inviteLink} onClick={handleShare}>
               Invite someone to try the test
              <Image 
                src="/icons/arrow-top-right.svg" 
                alt="" 
                width={16} 
                height={16} 
              />
            </button>
          </div>
        </div>

        {/* Column 2: Recommendation */}
        {scoreLevel === 1 ? (
          <div className={`${styles.card} ${styles.fadeIn}`} style={{ animationDelay: '0.2s' }}>
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
            <a href="https://www.audionova.com/phonak-virto-r-infinio/" className={styles.outlineButton}>Discover the product</a>
          </div>
        ) : scoreLevel === 2 ? (
          <div className={`${styles.card} ${styles.articleCard} ${styles.fadeIn}`} style={{ animationDelay: '0.2s' }}>
            <div className={styles.articleImageContainer}>
              <Image 
                src="/img/articles/article1.webp" 
                alt="Regular hearing tests"
                width={320} 
                height={200} 
                className={styles.articleImage}
              />
            </div>
            <div className={styles.articleContent}>
              <div className={styles.cardLabel}>RECOMMENDED FOR YOU</div>
              <h2 className={styles.cardTitle}>Know When to Get Checked</h2>
              <p className={styles.articleDescription}>
                Many don't know when to get a hearing test unless they have trouble hearing. Let’s change that.
              </p>
              <button className={styles.outlineButton} onClick={() => window.open('https://www.audionova.com/your-hearing-health/when-to-get-checked/', '_blank')}>
                Read the article
              </button>
            </div>
          </div>
        ) : (
          <div className={`${styles.card} ${styles.articleCard} ${styles.fadeIn}`} style={{ animationDelay: '0.2s' }}>
            <div className={styles.articleImageContainer}>
              <Image 
                src="/img/articles/article2.webp" 
                alt="Regular hearing tests" 
                width={320} 
                height={200} 
                className={styles.articleImage}
              />
            </div>
            <div className={styles.articleContent}>
              <div className={styles.cardLabel}>How to Improve Hearing</div>
              <h2 className={styles.cardTitle}>10 Steps to Hear Better</h2>
              {/* <p className={styles.articleDescription}>
                Know When to Get Checked
                Many don't know when to get a hearing test unless they have trouble hearing. Let’s change that.
              </p> */}
              <button className={styles.outlineButton} onClick={() => window.open('https://www.audionova.com/your-hearing-health/protect-your-hearing/', '_blank')}>
                Read the article
              </button>
            </div>
          </div>
        )}

        {/* Column 3: Contact */}
        <div className={`${styles.card} ${styles.fadeIn}`} style={{ animationDelay: '0.3s' }}>
          <div className={styles.cardLabel}>NEED ASSISTANCE?</div>
          <h2 className={styles.cardTitle}>Meet our hearing care experts</h2>
          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <Image src="/icons/location.svg" alt="" width={24} height={24} />
              <a href="https://www.audionova.com/clinics/search" target="_blank">
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
              <a href="mailto:info@audionova.com">
                info@audionova.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <button className={styles.legalButton} onClick={onLegalClick}>
        LEGAL
      </button>
    </main>
  );
}

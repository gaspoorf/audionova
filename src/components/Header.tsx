"use client";

import Image from 'next/image';
import styles from './Header.module.scss';

interface HeaderProps {
  compact?: boolean;
}

export default function Header({ compact }: HeaderProps) {
  return (
    <header className={`${styles.header} ${compact ? styles.compact : ''}`}>
      <div className={styles.logo}>
        <Image 
          src="/icons/logo.svg" 
          alt="AudioNova" 
          width={163} 
          height={32} 
          priority 
        />
      </div>
    </header>
  );
}

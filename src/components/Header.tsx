"use client";

import Image from 'next/image';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
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

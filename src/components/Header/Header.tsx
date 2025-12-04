'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button/Button';
import { Newspaper, LogOut, User } from 'lucide-react';
import styles from './Header.module.css';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Newspaper />
          </div>
          <div className={styles.brandText}>
            <h1>ePaper Hub</h1>
            <p>Your digital newspaper archive</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.userInfo}>
            <User />
            <span className={styles.welcomeText}>Welcome,</span>
            <span className={styles.username}>{user?.username}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut />
            <span className={styles.signOutText}>Sign Out</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}

import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          © {new Date().getFullYear()} ePaper Hub. All downloads are watermarked for security.
        </p>
      </div>
    </footer>
  );
}

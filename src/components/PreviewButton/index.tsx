import Link from 'next/link';
import styles from './previewButton.module.scss';

const PreviewButton: React.FC = () => {
  return (
    <Link href="/api/exit-preview">
      <a className={styles.previewButton}>Sair do modo Preview</a>
    </Link>
  );
};

export default PreviewButton;

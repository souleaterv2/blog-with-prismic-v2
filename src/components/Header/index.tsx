import Link from 'next/link';

import styles from './header.module.scss';

interface HeaderProps {
  nextPage?: {
    title: string;
    uid: string;
  };
  prevPage?: {
    title: string;
    uid: string;
  };
  preview?: boolean;
}

const Hedaer: React.FC<HeaderProps> = ({ nextPage, prevPage, preview }) => {
  return (
    <div
      className={
        nextPage || prevPage ? styles.postContainer : styles.listPostContainer
      }
    >
      <div className={styles.prevWrapper}>
        {preview
          ? null
          : prevPage && (
              <div className={styles.prev}>
                <span>{prevPage.title}</span>
                <Link href={`/post/${prevPage.uid}`}>
                  <a>Post Anterior</a>
                </Link>
              </div>
            )}
      </div>
      <Link href="/">
        <div className={styles.logo}>
          <a>
            <img src="/assets/Logo.svg" alt="logo" />
          </a>
        </div>
      </Link>
      <div className={styles.nexWrapper}>
        {preview
          ? null
          : nextPage && (
              <div className={styles.next}>
                <span>{nextPage.title}</span>
                <Link href={`/post/${nextPage.uid}`}>
                  <a>Próximo post</a>
                </Link>
              </div>
            )}
      </div>
    </div>
  );
};

export default Hedaer;

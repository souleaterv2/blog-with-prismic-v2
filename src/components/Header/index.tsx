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
}

const Hedaer: React.FC<HeaderProps> = ({ nextPage, prevPage }) => {
  return (
    <div
      className={
        nextPage || prevPage ? styles.postContainer : styles.listPostContainer
      }
    >
      <div>
        {prevPage && (
          <div className={styles.prev}>
            <span>{prevPage.title}</span>
            <Link href={`/post/${prevPage.uid}`}>
              <a>Post Anterior</a>
            </Link>
          </div>
        )}
      </div>
      <Link href="/">
        <a className={styles.logo}>
          <img src="/assets/Logo.svg" alt="logo" />
        </a>
      </Link>
      <div>
        {nextPage && (
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

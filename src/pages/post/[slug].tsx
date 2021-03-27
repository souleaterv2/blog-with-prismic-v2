import Head from 'next/head';

import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';

import Prismic from '@prismicio/client';
import { useEffect } from 'react';

import Header from '../../components/Header';
import Loading from '../../components/Loading';
import PreviewButton from '../../components/PreviewButton';

import { formatPost } from '../../util/format';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

export interface Post {
  first_publication_date: string | null;
  uid: string;
  id: string;
  nextPage: null | {
    title: string;
    uid: string;
  };
  prevPage: null | {
    title: string;
    uid: string;
  };
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  preview: boolean;
}

const Post: React.FC<PostProps> = ({ post, preview }) => {
  const { isFallback } = useRouter();

  useEffect(() => {
    const elem = document.getElementById('chat');
    const scriptElem = document.createElement('script');
    scriptElem.src = 'https://utteranc.es/client.js';
    scriptElem.async = true;
    scriptElem.crossOrigin = 'anonymous';
    scriptElem.setAttribute('repo', 'souleaterv2/blog-with-prismic');
    scriptElem.setAttribute('issue-term', 'pathname');
    scriptElem.setAttribute('label', 'blog-comment');
    scriptElem.setAttribute('theme', 'github-dark');
    elem.appendChild(scriptElem);

    return () => {
      const chat = document.querySelector('.utterances');
      chat.remove();
    };
  }, [post]);

  if (isFallback) {
    return <Loading />;
  }

  const formatedPost = formatPost(post);
  const { createdAt, data } = formatedPost;

  return (
    <>
      <Head>
        <title>{data.title} | BlogDeV</title>
      </Head>
      <Header nextPage={post.nextPage} prevPage={post.prevPage} />
      <div className={styles.banner}>
        <img src={data.banerUrl} alt="banner" />
      </div>
      <main className={styles.container}>
        <h1>{post.data.title}</h1>
        <div>
          <span>
            <FiCalendar /> <span>{createdAt}</span>
          </span>
          <span>
            <FiUser />
            <span>{data.author}</span>
          </span>
          <span>
            <FiClock /> <span>{data.minutesReading} min</span>
          </span>
        </div>
        {data.content.map(contentItem => {
          return (
            <article className={styles.content} key={contentItem.heading}>
              <h2>{contentItem.heading}</h2>
              <div dangerouslySetInnerHTML={{ __html: contentItem.body }} />
            </article>
          );
        })}
        <div id="chat" />
        {preview && <PreviewButton />}
      </main>
    </>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      pageSize: 20,
    }
  );

  const paths = postsResponse.results.map(result => ({
    params: {
      slug: result.uid,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {
    ref: previewData?.ref ?? null,
  });

  let nextPage = null;
  let prevPage = null;

  const nextPageResponse =
    (
      await prismic.query([Prismic.predicates.at('document.type', 'post')], {
        pageSize: 1,
        after: `${response.id}`,
        orderings: '[document.first_publication_date desc]',
      })
    ).results[0] ?? null;

  const prevPageResponse =
    (
      await prismic.query([Prismic.predicates.at('document.type', 'post')], {
        pageSize: 1,
        after: `${response.id}`,
        orderings: '[document.first_publication_date]',
      })
    ).results[0] ?? null;

  if (nextPageResponse) {
    nextPage = {
      uid: nextPageResponse.uid,
      title: nextPageResponse.data.title,
    };
  }

  if (prevPageResponse) {
    prevPage = {
      uid: prevPageResponse.uid,
      title: prevPageResponse.data.title,
    };
  }

  const post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,
    id: response.id,
    nextPage,
    prevPage,
    data: {
      author: response.data.author,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(item => ({
        heading: item.heading,
        body: item.body,
      })),
      title: response.data.title,
    },
  };
  return {
    props: {
      post,
      preview,
    },
  };
};

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import { MdDateRange  } from 'react-icons/md';
import { BiUser, BiTime } from 'react-icons/bi';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';


interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
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
}

export default function Post({ post }: PostProps) {
  const router = useRouter();
  const [count, setCount] = useState(0);

    if (router.isFallback) {
    return <div>Carregando...</div>;
  } 

  function averageReadingTime(): number {
    const totalWords = post.data.content.reduce((accWords, postContent) => {
      let postHeading = 0;
      let postBody = 0;

      if (postContent.heading) {
        postHeading = postContent.heading.trim().split(/\s+/).length;
      }

      if (RichText.asText(postContent.body)) {
        postBody = RichText.asText(postContent.body).trim().split(/\s+/).length;
      }

      return accWords + postHeading + postBody;
    }, 0);

    const wordsPerMinute = 200;
    return Math.ceil(totalWords / wordsPerMinute);
  }

  useEffect(() => {
    setCount(averageReadingTime());
  }, [])

  return (
      <>
        <Head>
          <title>Blog | Posts</title>
        </Head>
  
        <main>
          {
              <div className={styles.post}>
                <img 
                    src={post.data.banner.url}
                    alt="banner" 
                />
                <div 
                  className={commonStyles.container}
                >
                  <h1>{post.data.title}</h1>
                  <div className={commonStyles.box}>
                    <MdDateRange />
                    <time>{post.first_publication_date}</time>
                    <BiUser />
                    <p>{post.data.author}</p>
                    <BiTime />
                    <p>{count} min</p>
                </div>
                {post.data.content.map((content) => (
                    <div className={styles.content} key={content.heading}>
                      <h2>{content.heading}</h2>
                      {content.body.map((body) => (
                        <p key={body.text}>{body.text}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
          }
        </main>
      </>
    )
  }

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const paths = posts.results.map((post) => ({
    params: {
      slug: post.uid,
    },
  }));

  return {
    paths,
    fallback: true,
  }
};

export const getStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', params.slug);

  response.first_publication_date =  format(
    new Date(response.first_publication_date),
    "dd 'de' MMMM 'de' yyyy",
    {
      locale: ptBR,
    }
  )

  return {
    props: {
      post: response,
    },

    revalidate: 1,
  }
};

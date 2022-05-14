import Head from 'next/head';
import Link from 'next/link';

import { GetStaticProps } from 'next';
import { useState } from 'react';

import { getPrismicClient } from '../services/prismic';

import { MdDateRange  } from 'react-icons/md';
import { BiUser } from 'react-icons/bi';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const { next_page, results } = postsPagination;
  const [postsList, setPostsList] = useState(results);
  const [nextPage, setNextPage] = useState(next_page);

  function handlePagination() {
    fetch(nextPage)
      .then((response) => response.json())
      .then((data) => {
        const posts = data.results.map((post) => {
          return {
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          }
        });

        setPostsList([...postsList, ...posts]);
        setNextPage(data.next_page);
      });
  }


  return (
    <>
      <Head>
        <title>Blog | Home</title>
      </Head>

      <main className={commonStyles.container}>
            {
              postsList?.map((post) => (
                <div className={styles.posts} key={post.uid}>
                  <Link href={`/post/${post.uid}`}>
                  <a>
                    <h1>{post.data.title}</h1>
                    <h2>{post.data.subtitle}</h2>
                  </a>
                  </Link>
                    <div className={commonStyles.box}>
                      <MdDateRange />
                      <time>{
                        format(
                          new Date(post.first_publication_date),
                          "dd MMM yyyy",
                          { locale: ptBR })
                      }
                      </time> 
                      <BiUser />
                      <p>{post.data.author}</p>
                    </div>
                </div>
              ))
            }

        <div className={styles.containerMorePosts}>
          {
            nextPage ? <button onClick={handlePagination}>Carregar mais posts</button>: null
          }  
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1,
  });

  const posts = postsResponse.results.map((post) => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    }
  });

  return {
    props: { 
          postsPagination: {
            next_page: postsResponse.next_page,
            results: posts,
          }
    },

    revalidate: 60 * 60, // 1 hour
  }

};

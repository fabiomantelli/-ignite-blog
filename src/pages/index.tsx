import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';

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

export default function Home() {
  return (
    <>
      <Head>
        <title>Blog | Home</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <Link href="">
            <a>
              <h1>Como utilizar Hooks</h1>
              <h2>Pensando em sincronização em vez de ciclos de vida.</h2>
              <div className={styles.box}>
                <time>15 Mar 2021</time>
                <h3>Joseph Oliveira</h3>
              </div>
            </a>
          </Link>
          <Link href="">
            <a>
              <h1>Criando um app CRA do zero</h1>
              <h2>Tudo sobre como criar a sua primeira aplicação utilizando Create React App</h2>
              <div className={styles.box}>
                <time>19 Abr 2021</time>
                <h3>Danilo Vieira</h3>
              </div>
            </a>
          </Link>
          <Link href="">
            <a>
              <h1>Como utilizar Hooks</h1>
              <h2>Pensando em sincronização em vez de ciclos de vida.</h2>
              <div className={styles.box}>
                <time>15 Mar 2021</time>
                <h3>Joseph Oliveira</h3>
              </div>
            </a>
          </Link>
        </div>

        <div className={styles.containerMorePosts}>
          <strong>Carregar mais posts</strong>
        </div>
      </main>
    </>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };

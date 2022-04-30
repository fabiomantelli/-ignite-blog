import { AppProps } from 'next/app';
import Header from '../components/Header';

import '../styles/globals.scss';
import '../styles/common.module.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp;

import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, CSSReset } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';
import { DefaultSeo } from 'next-seo';
import { AnimateSharedLayout } from 'framer-motion';
import NextNProgress from 'nextjs-progressbar';
import { SessionProvider } from 'next-auth/react';

import theme from '@/styles/theme';
import { useApollo } from '@/lib/apolloClient';
import { ProvideSearch } from '@/util/search';

import { init } from '@/util/sentry';

import SEO from '../next-seo.config';

init();

const GlobalStyle = ({ children }) => (
  <>
    <CSSReset />
    <Global
      styles={css`
        html {
          min-width: 360px;
          scroll-behavior: smooth;
        }
        #__next {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
      `}
    />
    {children}
  </>
);

export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    console.log(metric);
  }
}

function MyApp({ Component, pageProps: { session, ...pageProps }, err }) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <SessionProvider session={session}>
        <ThemeProvider theme={theme}>
          <AnimateSharedLayout>
            <GlobalStyle />
            <DefaultSeo {...SEO} />
            <NextNProgress />
            <ProvideSearch>
              <Component {...pageProps} err={err} />
            </ProvideSearch>
          </AnimateSharedLayout>
        </ThemeProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}

export default MyApp;

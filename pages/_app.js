import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, CSSReset } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';
import { DefaultSeo } from 'next-seo';

import theme from '@/styles/theme';
import { useApollo } from '@/lib/apolloClient';
import { AuthProvider } from '@/lib/auth';
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

function MyApp({ Component, pageProps, err }) {
  const apolloClient = useApollo(pageProps);

  return (
    <AuthProvider>
      <ApolloProvider client={apolloClient}>
        <ProvideSearch>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <DefaultSeo {...SEO} />
            <Component {...pageProps} err={err} />
          </ThemeProvider>
        </ProvideSearch>
      </ApolloProvider>
    </AuthProvider>
  );
}

export default MyApp;

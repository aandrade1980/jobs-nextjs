import Head from 'next/head';
import { Box, Button, Heading } from '@chakra-ui/react';

import { GoogleIcon } from '@/components/Icons';
import { useAuth } from '@/lib/auth';

import { initializeApollo } from '@/lib/apolloClient';
import { ALL_CATEGORIES_QUERY } from '@/graphql/queries';

export default function Home() {
  const auth = useAuth();
  return (
    <div>
      <Head>
        <title>Post Jobs</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if (localStorage.getItem('post-job-auth')) {
            window.location.href = "/jobs"
          }
        `
          }}
        />
      </Head>

      <Box
        as="main"
        direction="column"
        align="center"
        justify="center"
        bg="gray.100"
        py={24}
      >
        <Heading>Welcome to Jobs Post</Heading>
        <Button
          mt={8}
          leftIcon={<GoogleIcon />}
          backgroundColor="white"
          color="black"
          fontWeight="medium"
          _hover={{ bg: 'gray.200' }}
          _active={{ transform: 'scale(0.95)', bg: 'gray.100' }}
          onClick={() => auth.signinWithGoogle()}
        >
          Continue with Google
        </Button>
      </Box>
    </div>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: ALL_CATEGORIES_QUERY
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract()
    },
    revalidate: 60
  };
}

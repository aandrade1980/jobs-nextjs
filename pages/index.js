import Head from 'next/head';
import { useQuery } from '@apollo/client';

import { ALL_JOBS_QUERY } from '@/graphql/queries';

import { Button } from '@chakra-ui/react';
import { GoogleIcon } from '@/components/Icons';
import { useAuth } from '@/lib/auth';

export default function Home() {
  const auth = useAuth();

  const { loading, error, data } = useQuery(ALL_JOBS_QUERY);

  if (error) {
    return <div>Error loading jobs</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  const { jobs: allJobs } = data;

  return (
    <div>
      <Head>
        <title>Post Jobs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to <code>Jobs Post</code>
        </h1>
        <Button
          size="md"
          backgroundColor="gray.100"
          leftIcon={<GoogleIcon />}
          color="black"
          _hover={{ bg: 'gray.300' }}
          _active={{ transform: 'scale(0.95)', bg: 'gray.200' }}
          onClick={() => auth.signinWithGoogle()}
        >
          Continue with Google
        </Button>
      </main>
    </div>
  );
}

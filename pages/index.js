import Head from 'next/head';
import { Box, Button, Heading } from '@chakra-ui/react';

import { GoogleIcon } from '@/components/Icons';
import { useAuth } from '@/lib/auth';
import NowPlaying from '@/components/NowPlaying';

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
          if (document.cookie && document.cookie.includes('token')) {
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
        mb={12}
      >
        <Heading>Welcome to Post Jobs</Heading>
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
      <NowPlaying />
    </div>
  );
}

import { MotionBox, MotionButton } from '@/util/chakra-motion';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import Head from 'next/head';

import { GoogleIcon } from '@/components/Icons';

import { useAuth } from '@/lib/auth';

import NowPlaying from '@/components/NowPlaying';

export default function Home() {
  const { signInWithGoogle } = useAuth();

  const handleSingInWithGoogle = useCallback(
    () => signInWithGoogle(),
    [signInWithGoogle]
  );

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

      <MotionBox
        as="main"
        direction="column"
        align="center"
        justify="center"
        bg="gray.100"
        py={24}
        mb={12}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.h2 animate={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
          Welcome to Post Jobs
        </motion.h2>
        <MotionButton
          mt={8}
          leftIcon={<GoogleIcon />}
          backgroundColor="white"
          color="black"
          fontWeight="medium"
          _hover={{ bg: 'gray.200' }}
          _active={{ transform: 'scale(0.95)', bg: 'gray.100' }}
          onClick={handleSingInWithGoogle}
        >
          Continue with Google
        </MotionButton>
      </MotionBox>
      <motion.div layoutId="now-playing">
        <NowPlaying />
      </motion.div>
    </div>
  );
}

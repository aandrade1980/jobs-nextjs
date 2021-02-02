import Head from 'next/head';
import { Box, Button, forwardRef } from '@chakra-ui/react';

import { GoogleIcon } from '@/components/Icons';
import { useAuth } from '@/lib/auth';
import NowPlaying from '@/components/NowPlaying';
import { MotionBox, MotionButton } from '@/util/chakra-motion';

import { motion } from 'framer-motion';

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
        <motion.h2 animate={{ fontSize: '2.5rem', fontWeight: 500 }}>
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
          onClick={() => auth.signinWithGoogle()}
          whileHover={{
            textShadow: '0 0 8px rgb(255, 255, 255)',
            boxShadow: '0 0 8px rgb(255, 255, 255)'
          }}
        >
          Continue with Google
        </MotionButton>
      </MotionBox>
      <NowPlaying />
    </div>
  );
}

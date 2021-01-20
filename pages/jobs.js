import { Box } from '@chakra-ui/react';
import React from 'react';

import { useAuth } from '@/lib/auth';
import Header from '@/components/Header';

const jobs = () => {
  const auth = useAuth();

  return (
    <Box backgroundColor="gray.100" h="100vh">
      <Header />
      {auth.user?.name}
    </Box>
  );
};

export default jobs;

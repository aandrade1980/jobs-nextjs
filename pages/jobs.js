import { Box } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from '@apollo/client';

import { GET_JOBS_BY_AUTHOR_QUERY } from '@/graphql/queries';
import Header from '@/components/Header';
import JobsTable from '@/components/JobsTable';
import JobsTableSkeleton from '@/components/JobsTableSkeleton';
import { JobsTableHeader } from '@/components/JobsTableHeader';
import { useAuth } from '@/lib/auth';

const jobs = () => {
  const { user } = useAuth();
  const { loading, error, data } = useQuery(GET_JOBS_BY_AUTHOR_QUERY, {
    variables: { authorId: user?.uid }
  });

  // Todo add a error toast
  if (error) {
    console.error(`Error getting jobs: ${error}`);
    return `Error loading jobs ${error}`;
  }

  if (loading) {
    return (
      <Box h="100vh" backgroundColor="gray.100">
        <Header />
        <Box px={8}>
          <JobsTableSkeleton />
        </Box>
      </Box>
    );
  }

  const { jobs: allJobs } = data;

  return (
    <Box h="100vh" backgroundColor="gray.100">
      <Header />
      <Box px={8}>
        <JobsTableHeader />
        <JobsTable jobs={allJobs} />
      </Box>
    </Box>
  );
};

export default jobs;

import { Box } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from '@apollo/client';

import { ALL_JOBS_QUERY } from '@/graphql/queries';
import Header from '@/components/Header';
import JobsTable from '@/components/JobsTable';
import JobsTableSkeleton from '@/components/JobsTableSkeleton';
import { JobsTableHeader } from '@/components/JobsTableHeader';

const jobs = () => {
  const { loading, error, data } = useQuery(ALL_JOBS_QUERY);

  if (error) {
    return <div>Error loading jobs</div>;
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

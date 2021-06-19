import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import nookies from 'nookies';
import React from 'react';

import { admin } from '@/lib/firebaseAdmin';
import { useSearch } from '@/util/search';
import { useJobsByAuthor } from '@/graphql/hooks';

// Components
import Header from '@/components/Header';
import Page from '@/components/Page';

// Dynamic Render
const JobsTableHeaderComponent = dynamic(() =>
  import('@/components/JobsTableHeader')
);
const JobsTableComponent = dynamic(() => import('@/components/JobsTable'));
const JobsTableSkeletonComponent = dynamic(() =>
  import('@/components/JobsTableSkeleton')
);

const LoadingState = ({ children }) => (
  <Box minH="100vh" backgroundColor="gray.100">
    <Header active="jobs" />
    <Box px={8} maxW="1250px" margin="0 auto">
      {children}
    </Box>
  </Box>
);

const Jobs = ({ userId }) => {
  const { loading: loadingJobs, error, data } = useJobsByAuthor(userId);
  const { search } = useSearch();

  if (error || loadingJobs) {
    error && console.error(`Error in Jobs page: ${error}`);
    return (
      <LoadingState>
        <JobsTableSkeletonComponent />
      </LoadingState>
    );
  }

  const { jobs: allJobs } = data;

  const filteredJobs = allJobs.filter(
    job =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LoadingState>
      <JobsTableHeaderComponent />
      <JobsTableComponent jobs={filteredJobs} />
    </LoadingState>
  );
};

const JobsPage = ({ userId }) => (
  <Page name="Jobs" path="/jobs">
    <Jobs userId={userId} />
  </Page>
);

export default JobsPage;

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await admin.auth().verifyIdToken(cookies.token);
    const { uid } = token;

    return {
      props: { userId: uid }
    };
  } catch (error) {
    console.error(error);
    nookies.destroy(context, 'token');

    return {
      redirect: {
        destination: '/',
        statusCode: 302
      }
    };
  }
}

import { Box } from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import nookies from 'nookies';
import React from 'react';

import { admin } from '@/lib/firebaseAdmin';
import { GET_JOBS_BY_AUTHOR_QUERY } from '@/graphql/queries';
import { JobsTableHeader } from '@/components/JobsTableHeader';
import Header from '@/components/Header';
import JobsTable from '@/components/JobsTable';
import JobsTableSkeleton from '@/components/JobsTableSkeleton';
import Page from '@/components/Page';

const Jobs = ({ userId }) => {
  const { loading, error, data } = useQuery(GET_JOBS_BY_AUTHOR_QUERY, {
    variables: { authorId: userId },
    skip: userId === undefined
  });

  // Todo add a error toast
  if (error) {
    console.error(`Error getting jobs: ${error}`);
    return `Error loading jobs ${error}`;
  }

  if (loading || !userId) {
    return (
      <Box h="100vh" backgroundColor="gray.100">
        <Header active="jobs" />
        <Box px={8} maxW="1250px" margin="0 auto">
          <JobsTableSkeleton />
        </Box>
      </Box>
    );
  }

  const { jobs: allJobs } = data;

  return (
    <Box minH="100vh" backgroundColor="gray.100">
      <Header active="jobs" />
      <Box px={8} maxW="1250px" margin="0 auto">
        <JobsTableHeader />
        <JobsTable jobs={allJobs} />
      </Box>
    </Box>
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
    context.res.writeHead(302, { Location: '/' });
    context.res.end();

    return { props: {} };
  }
}

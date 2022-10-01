import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import { getSession } from 'next-auth/react';

// Utils
import { useSearch } from '@/util/search';

// Hooks
import { useAuth } from '@/hooks/hooks';
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
    <Box as="main" px={8} maxW="1250px" margin="0 auto">
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

const JobsPage = () => {
  const { user } = useAuth();

  return (
    <Page name="Jobs" path="/jobs">
      {user?.id && <Jobs userId={user.id} />}
    </Page>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return {
    props: {
      session
    }
  };
}

export default JobsPage;

import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';

import { GET_JOB_BY_ID_QUERY } from '@/graphql/queries';

const JobPage = () => {
  const route = useRouter();
  const job = route.query?.job;

  const { loading, error, data } = useQuery(GET_JOB_BY_ID_QUERY, {
    variables: { id: job },
    skip: job === undefined
  });

  if (loading) {
    return <Box>Loading Job...</Box>;
  }

  if (error) {
    console.error(`Error getting the job: ${error}`);
  }

  console.log('DATA => ', data['jobs_by_pk']);

  const currentJob = data['jobs_by_pk'];

  return <div>{currentJob.title}</div>;
};

export default JobPage;

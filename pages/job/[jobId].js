import {
  Badge,
  Box,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text
} from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import {
  ALL_JOBS_QUERY,
  GET_CATEGORIES_BY_ID_QUERY,
  GET_JOB_BY_ID_QUERY
} from '@/graphql/queries';

import Header from '@/components/Header';
import { initializeApollo } from '@/lib/apolloClient';
import AddJobModal from '@/components/AddJobModal';
import { useQuery } from '@apollo/client';

export async function getStaticPaths() {
  const apolloClient = initializeApollo();
  const {
    data: { jobs }
  } = await apolloClient.query({
    query: ALL_JOBS_QUERY
  });

  const paths = jobs.map(({ id }) => ({
    params: {
      jobId: id
    }
  }));

  return {
    paths,
    fallback: true
  };
}

export async function getStaticProps({ params }) {
  const { jobId } = params;
  const apolloClient = initializeApollo();

  const {
    data: { jobs_by_pk }
  } = await apolloClient.query({
    query: GET_JOB_BY_ID_QUERY,
    variables: { id: jobId }
  });

  await apolloClient.query({
    query: GET_CATEGORIES_BY_ID_QUERY,
    variables: { _in: jobs_by_pk.categoriesIds }
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      jobId
    },
    revalidate: 1
  };
}

const JobPage = ({ jobId }) => {
  const { loading: loadingJob, error: errorJob, data } = useQuery(
    GET_JOB_BY_ID_QUERY,
    {
      variables: { id: jobId },
      skip: jobId === undefined,
      fetchPolicy: 'cache-and-network'
    }
  );

  const {
    loading: loadingCategories,
    error: errorCategories,
    data: dataCategories
  } = useQuery(GET_CATEGORIES_BY_ID_QUERY, {
    variables: { _in: data?.jobs_by_pk?.categoriesIds },
    skip: data === undefined
  });
  const router = useRouter();

  if (errorJob || errorCategories) {
    console.error(`Error: ${errorJob || errorCategories}`);
  }

  if (router.isFallback || loadingJob || loadingCategories) {
    return (
      <Box h="100vh" backgroundColor="gray.100">
        <Header />
        <Flex px={8} maxW="1250px" margin="50px auto" justifyContent="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      </Box>
    );
  }

  const {
    title,
    company,
    email,
    postedDate,
    imageUrl,
    description
  } = data.jobs_by_pk;

  const { categories } = dataCategories;

  const colorScheme = [
    'green',
    'red',
    'purple',
    'orange',
    'yellow',
    'teal',
    'cyan',
    'pink'
  ];

  const randomItem = () =>
    colorScheme[Math.floor(Math.random() * colorScheme.length)];

  return (
    <Box h="100vh" backgroundColor="gray.100">
      <Header />
      <Box px={8} maxW="1250px" margin="50px auto" backgroundColor="gray.100">
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <AddJobModal
            buttonText="Edit Job"
            title="Edit Job"
            job={data.jobs_by_pk}
          />
        </Box>
        <Grid
          gridTemplateColumns="1fr 1fr"
          gridTemplateRows="auto"
          gridTemplateAreas='"title image" "company image" "categories image" "email image" "date image" "description description"'
          rowGap="20px"
          alignItems="center"
        >
          <Heading as="h2" size="2xl" gridArea="title">
            {title}
          </Heading>
          <Heading as="h3" size="lg" gridArea="company">
            {company}
          </Heading>
          <Flex gridArea="categories" flexWrap="wrap">
            {categories.map(({ id, name }) => (
              <Badge colorScheme={randomItem()} key={id} mr={2} mb={2}>
                {name}
              </Badge>
            ))}
          </Flex>
          <Heading as="h4" size="md" gridArea="email">
            {email}
          </Heading>
          <Heading as="h4" size="md" gridArea="date">
            {postedDate}
          </Heading>
          {imageUrl && (
            <Box
              gridArea="image"
              position="relative"
              height="auto"
              minH="400px"
            >
              <Image
                src={imageUrl}
                layout="fill"
                objectFit="scale-down"
                objectPosition="top"
              />
            </Box>
          )}
          <Text whiteSpace="pre-line" gridArea="description">
            {description}
          </Text>
        </Grid>
      </Box>
    </Box>
  );
};

export default JobPage;

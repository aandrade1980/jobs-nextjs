import { useQuery } from '@apollo/client';
import {
  GET_CATEGORIES_BY_AUTHOR_ID_QUERY,
  GET_CATEGORIES_BY_ID_QUERY,
  GET_JOB_BY_ID_QUERY,
  GET_JOBS_BY_AUTHOR_QUERY
} from './queries';

export const useJobsByAuthor = authorId => {
  const { loading, error, data } = useQuery(GET_JOBS_BY_AUTHOR_QUERY, {
    variables: { authorId },
    skip: !authorId
  });

  return { loading, error, data };
};

export const useJobById = jobId => {
  const { loading, error, data } = useQuery(GET_JOB_BY_ID_QUERY, {
    variables: { id: jobId },
    fetchPolicy: 'cache-and-network'
  });

  return { loading, error, data };
};

export const useCategoriesByAuthor = authorId => {
  const { loading, error, data } = useQuery(GET_CATEGORIES_BY_AUTHOR_ID_QUERY, {
    variables: { authorId },
    skip: !authorId
  });

  return { loading, error, data };
};

export const useCategoriesById = categoriesIds => {
  const { loading, error, data } = useQuery(GET_CATEGORIES_BY_ID_QUERY, {
    variables: { _in: categoriesIds },
    skip: !categoriesIds
  });

  return { loading, error, data };
};

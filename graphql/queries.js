import { gql } from '@apollo/client';

// #Jobs
export const ALL_JOBS_QUERY = gql`
  query allJobs {
    jobs {
      id
    }
  }
`;

export const GET_JOBS_BY_AUTHOR_QUERY = gql`
  query getJobs($authorId: String!) {
    jobs(
      where: { authorId: { _eq: $authorId } }
      order_by: { postedDate: desc }
    ) {
      authorId
      categoriesIds
      company
      createdAt
      description
      email
      id
      imageUrl
      postedDate
      title
    }
  }
`;

export const GET_JOB_BY_ID_QUERY = gql`
  query getJob($id: uuid!) {
    jobs_by_pk(id: $id) {
      categoriesIds
      company
      createdAt
      description
      email
      id
      imageUrl
      postedDate
      title
    }
  }
`;

// #Categories
export const GET_CATEGORIES_BY_AUTHOR_ID_QUERY = gql`
  query getCategoriesByAuthor($authorId: String) {
    categories(
      where: { authorId: { _eq: $authorId } }
      order_by: { name: asc }
    ) {
      name
      id
    }
  }
`;

export const GET_CATEGORIES_BY_ID_QUERY = gql`
  query getCategories($_in: [uuid!]) {
    categories(where: { id: { _in: $_in } }) {
      id
      name
    }
  }
`;

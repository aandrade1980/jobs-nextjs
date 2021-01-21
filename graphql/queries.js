import { gql } from '@apollo/client';

export const ALL_JOBS_QUERY = gql`
  query allJobs {
    jobs(order_by: { postedDate: desc }) {
      categoriesIds
      company
      createdAt
      description
      email
      postedDate
      id
      title
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
      postedDate
      title
      id
    }
  }
`;

export const ALL_CATEGORIES_QUERY = gql`
  query allCategories {
    categories {
      id
      name
    }
  }
`;

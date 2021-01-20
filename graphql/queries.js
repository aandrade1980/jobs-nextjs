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

export const ALL_CATEGORIES_QUERY = gql`
  query allCategories {
    categories {
      id
      name
    }
  }
`;

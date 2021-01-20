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

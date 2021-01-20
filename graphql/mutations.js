import { gql } from '@apollo/client';

export const CREATE_JOB_MUTATION = gql`
  mutation createJob(
    $company: String
    $email: String
    $postedDate: date
    $title: String!
  ) {
    insert_jobs(
      objects: {
        company: $company
        email: $email
        postedDate: $postedDate
        title: $title
      }
    ) {
      returning {
        categoriesIds
        company
        createdAt
        description
        email
        id
        postedDate
        title
      }
    }
  }
`;

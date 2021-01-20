import { gql } from '@apollo/client';

export const CREATE_JOB_MUTATION = gql`
  mutation createJob(
    $company: String
    $email: String
    $postedDate: date
    $title: String!
    $description: String
    $categoriesIds: _text
  ) {
    insert_jobs(
      objects: {
        company: $company
        email: $email
        postedDate: $postedDate
        title: $title
        description: $description
        categoriesIds: $categoriesIds
      }
    ) {
      returning {
        id
      }
    }
  }
`;

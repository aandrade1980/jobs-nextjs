import { gql } from '@apollo/client';

export const CREATE_JOB_MUTATION = gql`
  mutation createJob(
    $company: String
    $email: String
    $postedDate: date
    $title: String!
    $description: String
    $categoriesIds: _text
    $authorId: String
  ) {
    insert_jobs(
      objects: {
        company: $company
        email: $email
        postedDate: $postedDate
        title: $title
        description: $description
        categoriesIds: $categoriesIds
        authorId: $authorId
      }
    ) {
      returning {
        id
      }
    }
  }
`;

export const DELETE_JOB_BY_ID_MUTATION = gql`
  mutation deleteJob($id: uuid!) {
    delete_jobs_by_pk(id: $id) {
      id
    }
  }
`;

export const CREATE_CATEGORY_MUTATION = gql`
  mutation createCategory($name: String!) {
    insert_categories_one(object: { name: $name }) {
      id
      name
    }
  }
`;

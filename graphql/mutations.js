import { gql } from '@apollo/client';

// Jobs
export const CREATE_JOB_MUTATION = gql`
  mutation createJob(
    $authorId: String
    $categoriesIds: _text
    $company: String
    $description: String
    $email: String
    $imageUrl: String
    $postedDate: date
    $requestSent: Boolean
    $title: String!
  ) {
    insert_jobs(
      objects: {
        authorId: $authorId
        categoriesIds: $categoriesIds
        company: $company
        description: $description
        email: $email
        imageUrl: $imageUrl
        postedDate: $postedDate
        requestSent: $requestSent
        title: $title
      }
    ) {
      returning {
        company
        id
        imageUrl
        postedDate
        requestSent
        title
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

export const UPDATE_JOB_BY_ID_MUTATION = gql`
  mutation updateJob(
    $_eq: uuid
    $categoriesIds: _text
    $company: String
    $description: String
    $email: String
    $postedDate: date
    $requestSent: Boolean
    $title: String
  ) {
    update_jobs(
      where: { id: { _eq: $_eq } }
      _set: {
        categoriesIds: $categoriesIds
        company: $company
        description: $description
        email: $email
        postedDate: $postedDate
        requestSent: $requestSent
        title: $title
      }
    ) {
      returning {
        categoriesIds
        company
        description
        email
        id
        imageUrl
        postedDate
        requestSent
        title
      }
    }
  }
`;

export const UPDATE_JOB_REQUEST_SENT_BY_ID_MUTATION = gql`
  mutation updateJobRequestSentValue($id: uuid!, $requestSent: Boolean) {
    update_jobs_by_pk(
      pk_columns: { id: $id }
      _set: { requestSent: $requestSent }
    ) {
      id
    }
  }
`;

// Categories
export const CREATE_CATEGORY_MUTATION = gql`
  mutation createCategory($authorId: String!, $name: String!) {
    insert_categories_one(object: { authorId: $authorId, name: $name }) {
      id
    }
  }
`;

export const DELETE_CATEGORY_BY_ID_MUTATION = gql`
  mutation deleteCategory($id: uuid!) {
    delete_categories_by_pk(id: $id) {
      id
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation updateCategory($id: uuid!, $name: String) {
    update_categories_by_pk(pk_columns: { id: $id }, _set: { name: $name }) {
      authorId
      createdAt
      id
      name
    }
  }
`;

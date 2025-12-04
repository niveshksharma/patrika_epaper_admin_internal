import { gql } from '@apollo/client';

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      user {
        id
        email
        username
      }
      token
      error
    }
  }
`;

export const SIGN_UP = gql`
  mutation SignUp($email: String!, $password: String!, $username: String!) {
    signUp(email: $email, password: $password, username: $username) {
      user {
        id
        email
        username
      }
      token
      error
    }
  }
`;

export const DOWNLOAD_EPAPER = gql`
  mutation DownloadEPaper($epaperId: ID!, $username: String!) {
    downloadEPaper(epaperId: $epaperId, username: $username) {
      success
      url
      error
    }
  }
`;

export const LOG_DOWNLOAD = gql`
  mutation LogDownload($userId: ID!, $epaperId: ID!) {
    logDownload(userId: $userId, epaperId: $epaperId) {
      id
      downloadedAt
    }
  }
`;

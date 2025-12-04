import { gql } from '@apollo/client';

export const GET_STATES = gql`
  query GetStates {
    states {
      id
      name
    }
  }
`;

export const GET_CITIES = gql`
  query GetCities($stateId: ID) {
    cities(stateId: $stateId) {
      id
      name
      stateId
    }
  }
`;

export const GET_EPAPERS = gql`query getEpaper {
  epaperEditions{
    id
    name
    slug
    url
    parent
    edition_priority
    children
    imageurl
  }
}`

export const GET_EDITION = gql`
  query getPdfData($id: String!, $date: String!) {
    epaperChildEditionByIdDate(id: $id, date: $date) {
      id
      title
      edition_date
      epaper_master_edition
      epaper_child_edition
      epaper_single_pdf
      group_epaper_pdf
    }
  }
`;

export const GET_EPAPER = gql`
  query GetEPaper($id: ID!) {
    epaper(id: $id) {
      id
      title
      description
      publicationDate
      filePath
      thumbnailUrl
      state {
        id
        name
      }
      city {
        id
        name
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      username
      createdAt
    }
  }
`;
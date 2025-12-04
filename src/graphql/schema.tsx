export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    username: String!
    createdAt: String!
  }

  type State {
    id: ID!
    name: String!
    cities: [City!]!
  }

  type City {
    id: ID!
    name: String!
    stateId: ID!
    state: State
  }

  type EPaper {
    id: ID!
    title: String!
    description: String
    publicationDate: String!
    stateId: ID!
    cityId: ID!
    filePath: String!
    thumbnailUrl: String
    state: State!
    city: City!
  }

  type DownloadLog {
    id: ID!
    userId: ID!
    epaperId: ID!
    downloadedAt: String!
    user: User
    epaper: EPaper
  }

  type AuthPayload {
    user: User
    token: String
    error: String
  }

  type DownloadPayload {
    success: Boolean!
    url: String
    error: String
  }

  type Query {
    # User queries
    me: User
    users: [User!]!

    # Location queries
    states: [State!]!
    cities(stateId: ID): [City!]!

    # EPaper queries
    epapers(stateId: ID, cityId: ID, date: String, search: String): [EPaper!]!
    epaper(id: ID!): EPaper

    # Download logs
    downloadLogs(userId: ID): [DownloadLog!]!
  }

  type Mutation {
    # Auth mutations
    signIn(email: String!, password: String!): AuthPayload!
    signUp(email: String!, password: String!, username: String!): AuthPayload!
    signOut: Boolean!

    # Download mutations
    downloadEPaper(epaperId: ID!, username: String!): DownloadPayload!
    logDownload(userId: ID!, epaperId: ID!): DownloadLog
  }
`;

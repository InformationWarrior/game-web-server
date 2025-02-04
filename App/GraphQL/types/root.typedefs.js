const { gql } = require('apollo-server-express');

const rootType = gql`
  scalar ObjectId

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`;

module.exports = rootType;

const { gql } = require("apollo-server-express");

// Define the schema (type definitions)
const typedefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    addSelection(betAmount: Float!, totalPlayerRounds: Int!, currency: String!): AddSelectionResponse
  }

  type AddSelectionResponse {
    success: Boolean!
    message: String!
  }
`;

// Export schema for server setup
module.exports = typedefs;

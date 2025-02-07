const { gql } = require('apollo-server-express');

const wheelSpinTypeDefs = gql`
  type Selection {
    _id: ObjectId!
    betAmount: Float!
    totalPlayerRounds: Int!
    currency: String!
  }

  type AddSelectionResponse {
    success: Boolean!
    message: String!
    selection: Selection
  }
`;

module.exports = wheelSpinTypeDefs;

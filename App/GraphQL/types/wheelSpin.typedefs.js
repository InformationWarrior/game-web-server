const { gql } = require('apollo-server-express');

const wheelSpinTypeDefs = gql`
  type PlayerBetInput {
    _id: ObjectId!
    betAmount: Float!
    totalPlayerRounds: Int!
    currency: String!
  }

  type PlayerBetResult {
    success: Boolean!
    message: String!
    placedBet: PlayerBetInput
  }

  extend type Mutation {
    placeBet(currency: String!, betAmount: Float!, totalPlayerRounds: Int!): PlayerBetResult
  }
`;

module.exports = wheelSpinTypeDefs;

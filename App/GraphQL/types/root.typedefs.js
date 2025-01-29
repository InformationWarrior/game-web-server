const { gql } = require('apollo-server-express');

const rootType = gql`
  scalar ObjectId

  type Query {
    getPlacedBets: [PlayerBetInput]
  }

  type Mutation {
    placeBet(betAmount: Float!, totalPlayerRounds: Int!, currency: String!): PlayerBetResult
  }

  type Subscription {
    betPlaced: PlayerBetResult
  }
`;

module.exports = rootType;

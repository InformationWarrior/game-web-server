const { gql } = require('apollo-server-express');

const wheelSpinTypeDefs = gql`
  extend type Query {
    getPlacedBets: [PlayerBetInput]
    getGameState: GameState!
  }

  extend type Mutation {
    placeBet(betAmount: Float!, totalPlayerRounds: Int!, currency: String!): PlayerBetResult
  }

  extend type Subscription {
    betPlaced: PlayerBetResult
    gameStateUpdated: GameState!
  }

  type PlayerBetInput {
    _id: ObjectId!
    betAmount: Float!
    totalPlayerRounds: Int!
    currency: String!
  }

  type PlayerBetResult {
    success: Boolean!
    message: String!
    bet: PlayerBetInput
  }

  enum GameState {
    RESET
    BETTING
    SPINNING
    END
  }

  type GameStatus {
    state: GameState!
    remainingTime: Int!
  }
`;

module.exports = wheelSpinTypeDefs;

const { gql } = require('apollo-server-express');

const wheelSpinTypeDefs = gql`
  extend type Query {
    getPlacedBets: [PlayerBetInput]
    getGameStatus: GameStatus!
  }

  extend type Mutation {
    placeBet(betAmount: Float!, totalPlayerRounds: Int!, currency: String!): PlayerBetResult
  }

  extend type Subscription {
    betPlaced: PlayerBetResult
    gameStatusUpdated: GameStatus!
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
    RUNNING
    END
  }

  type GameStatus {
    gameState: GameState!
    remainingTime: Int!
  }
`;

module.exports = wheelSpinTypeDefs;
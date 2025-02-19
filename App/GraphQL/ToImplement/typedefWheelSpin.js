
const { gql } = require('apollo-server-express');

const wheelSpinTypeDefs = gql`
  extend type Query {
    getGameStatus(gameId: ID!): GameStatus!
    getParticipantPlayers(gameId: ID!): [Player!]
    getGameLeaderboard(gameId: ID!): [LeaderboardEntry!]
    getGameStats(gameId: ID!): GameStats!
    getPlacedBets(gameId: ID!): [PlayerBet!]
    getHighestBet(gameId: ID!): PlayerBet
    getLowestBet(gameId: ID!): PlayerBet
    getBettingTrends(gameId: ID!): [BetTrend!]
    getGamePool(gameId: ID!): Float!
  }

  extend type Mutation {
    placeBet(gameId: ID!, walletAddress: String!, amount: Float!, currency: String!, betOption: String!, totalPlayerRounds: Int!): PlayerBetResult!
    updateGameState(gameId: ID!, state: GameState!): GameStatus!
    setWinningBet(gameId: ID!, winningBetOption: String!): WinningBetResult!
    extendGameDuration(gameId: ID!, extraTime: Int!): GameStatus!
    cancelGame(gameId: ID!): GameStatus!
    freezeGame(gameId: ID!): GameStatus!
    resumeGame(gameId: ID!): GameStatus!
    restartGame(gameId: ID!): GameStatus!
    setGameJackpot(gameId: ID!, jackpotAmount: Float!): GameJackpotResult!
    refundBet(betId: ID!): RefundResult!
  }

  extend type Subscription {
    gameResults(gameId: ID!): GameResult!
    gameCountdown(gameId: ID!): Countdown!
    gameFrozen(gameId: ID!): GameStatus!
    jackpotUpdated(gameId: ID!): JackpotUpdate!
    playerParticipated(gameId: ID!): Player!
    playerJoined(gameId: ID!): Player!
    betPlaced(gameId: ID!): PlayerBetResult!
  }

  type Player {
    walletAddress: String!
    username: String
    profileImage: String
  }

  type PlayerBet {
    _id: ID!
    walletAddress: String!
    betAmount: Float!
    totalPlayerRounds: Int!
    currency: String!
    betOption: String!
  }

  type PlayerBetResult {
    success: Boolean!
    message: String!
    bet: PlayerBet
  }

  type ParticipationResult {
    success: Boolean!
    message: String!
    player: Player
  }

  type GameStats {
    totalBets: Int!
    totalParticipants: Int!
    totalPool: Float!
  }

  type LeaderboardEntry {
    walletAddress: String!
    username: String
    totalWinnings: Float!
  }

  type WinningBetResult {
    success: Boolean!
    message: String!
    winningBetOption: String!
  }

  type BetTrend {
    betOption: String!
    totalBets: Int!
  }

  type GameJackpotResult {
    success: Boolean!
    message: String!
    jackpotAmount: Float!
  }

  type RefundResult {
    success: Boolean!
    message: String!
    refundedBet: PlayerBet
  }

  type GameResult {
    gameId: ID!
    winningBetOption: String!
  }

  type Countdown {
    gameId: ID!
    remainingTime: Int!
  }

  type JackpotUpdate {
    gameId: ID!
    newJackpot: Float!
  }
`;

module.exports = wheelSpinTypeDefs;
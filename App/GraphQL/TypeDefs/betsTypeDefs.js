const { gql } = require('apollo-server-express');

const betsTypeDefs = gql`
  # Queries
  extend type Query {
    getEnteredPlayers(gameId: ID!): [PlayerEnteredPayload!]!
    getParticipantsAndBets(gameId: ID!): ParticipantsAndBetsPayload!
    getAllGames: [Game!]!
    getBetHistoryByWallet(walletAddress: String!): [BetHistory]!
    getRound(gameId: ID!, walletAddress: String!): GetRoundPayload!
  }

  # Mutations
  extend type Mutation {
    createGame(
      name: String!
      type: String!
      maxPlayers: Int!
    ): CreateGamePayload!

    createPlayer(
      walletAddress: String!
      username: String!
      balance: Float!
      currency: String!
    ): CreatePlayerPayload!

    enterGame(gameId: ID!, walletAddress: String!): PlayerEnteredPayload!
    leaveGame(gameId: ID!, walletAddress: String!): Game!

    placeBetAndParticipate(
      gameId: ID!,
      walletAddress: String!,
      betAmount: Float!,
      currency: String!
    ): RoundUpdatedPayload!
  }

  # Subscriptions
  extend type Subscription {
    playerEntered(gameId: ID!, walletAddress: String!): PlayerEnteredPayload!
    gameStatusUpdated: GameStatus!
    roundUpdated(gameId: ID!): RoundUpdatedPayload!
  }

  # Game Related Types
  type Game {
    _id: ID!
    name: String!
    type: String!
    state: GameState!
    enteredPlayers: [Player!]!
    spectators: [Player!]!
    maxPlayers: Int!
    totalRounds: Int!
    latestRound: Round
  }

  type CreateGamePayload {
    _id: ID!
    name: String!
    type: String!
    state: GameState!
    enteredPlayers: [Player!]!
    spectators: [Player!]!
    maxPlayers: Int!
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

  # Round Related Types
  type Round {
    _id: ID!
    game: ID!
    roundNumber: Int!
    participants: [Player!]!
    bets: [Bet!]!
    winner: Player
    createdAt: String!
  }

  type GetRoundPayload {
    _id: ID!
    gameId: ID!
    roundNumber: Int!
    totalBetAmount: Float!
    winningChance: Float!
    participants: [ParticipantPayload!]!
    bets: [BetPayload!]!
    startedAt: String!
  }

  type RoundUpdatedPayload {
    _id: ID!
    gameId: ID!
    roundNumber: Int!
    totalBetAmount: Float!
    participants: [ParticipantPayload!]!
    bets: [BetPayload!]!
    winner: Player
    startedAt: String!
  }

  # Participants and Bets
  type ParticipantsAndBetsPayload {
    participants: [ParticipantPayload!]!
    bets: [BetPayload!]!
  }

  type ParticipantPayload {
    walletAddress: String!
    username: String!
    betAmount: Float!
    currency: String!
    winningChance: Float!
  } 

  type BetPayload {
    id: ID!
    game: ID!
    player: PlayerInfo!
    amount: Float!
    currency: String!
    betOption: String
    usdEquivalent: Float
    exchangeRate: Float
    transactionHash: String
    timestamp: String
    multiBet: Boolean
    strategy: String
  }

  type Bet {
    id: ID!
    player: Player!
    game: ID!
    amount: Float!
    currency: String!
    usdEquivalent: Float!
    betOption: String!
    exchangeRate: Float!
    transactionHash: String
    timestamp: String!
    multiBet: Boolean!
    strategy: String!
  }

  type BetHistory {
    amount: Float!
    username: String!
    winAmount: Float!
  }

  # Player Related Types
  type Player {
    walletAddress: String!
    username: String!
    profileImage: String
    balance: Float!
    currency: String!
    totalWins: Int!
    totalLosses: Int!
    gamesPlayed: Int!
    rank: String
    referralCount: Int!
  }

  type PlayerInfo {
    walletAddress: String!
    username: String!
  }

  type CreatePlayerPayload {
    success: Boolean!
    message: String!
    player: Player
  }

  type PlayerEnteredPayload {
    gameId: ID!
    walletAddress: String!
    username: String!
  }
`;

module.exports = betsTypeDefs;

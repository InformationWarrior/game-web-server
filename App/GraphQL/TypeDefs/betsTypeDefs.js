const { gql } = require('apollo-server-express');

const betsTypeDefs = gql`
  extend type Query {
    getEnteredPlayers(gameId: ID!): [Player!]!
    getParticipants(gameId: ID!): [Player!]!
    getWallet(walletAddress: String!): Wallet!
  }

  extend type Mutation {
  # Game Mutations
    createGame(
      name: String!
      type: String!
      maxPlayers: Int!
      maxParticipants: Int!
    ): Game!
    
    enterGame(gameId: ID!, walletAddress: String!): Game!
    leaveGame(gameId: ID!, walletAddress: String!): Game!

    #Player Mutations
    createPlayer(
      walletAddress: String!
      username: String!
      balance: Float!
      currency: String!
    ): CreatePlayerResponse!

    participateInGame(gameId: ID!, walletAddress: String!): Game!
    removeParticipants(gameId: ID!): Game!
    placeBet(gameId: ID!, walletAddress: String!, amount: Float!, currency: String!, totalPlayerRounds: Int!): Bet!
  }

  extend type Subscription {
    playerParticipated(gameId: ID!, walletAddress: String!): PlayerParticipatedPayload!
    playerEntered(gameId: ID!, walletAddress: String!): PlayerEnteredPayload!
    betPlaced(gameId: ID!, walletAddress: String!): Bet!
    gameStatusUpdated: GameStatus!
  }

  # Response Type for createPlayer
  type CreatePlayerResponse {
    success: Boolean!
    message: String!
    player: Player
  }

  type Game {
    id: ID!
    name: String!
    type: String!
    state: String!
    enteredPlayers: [Player!]! # Players who entered the game (but may not play)
    participants: [Player!]! # Players who actually play by placing a bet
    spectators: [Player!]! # Players who are only watching
    maxPlayers: Int!
    maxParticipants: Int! # Limit for actual players who can bet
  }

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

  type Wallet {
    walletAddress: String!
    balance: Float!
    currency: String!
  }

  type PlayerParticipatedPayload {
    gameId: ID!
    walletAddress: String!
    game: Game!
  }
    
  type PlayerEnteredPayload {
    gameId: ID!
    walletAddress: String!
    game: Game!
  }

  type Bet {
    gameId: ID!
    walletAddress: String!
    amount: Float!
    currency: String!
    totalPlayerRounds: Int!
    game: Game!
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

module.exports = betsTypeDefs;

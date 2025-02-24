const { gql } = require('apollo-server-express');

const betsTypeDefs = gql`
  extend type Query {
    getEnteredPlayers(gameId: ID!): [Player!]!
    getParticipants(gameId: ID!): [ParticipantPayload!]!
    getBets(gameId: ID!): [Bet!]!
    getAllGames: [Game!]! # Added query to get all games list
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

    placeBetAndParticipate(gameId: ID!, walletAddress: String!, betAmount: Float!, currency: String!): ParticipantPayload!
    removeParticipants(gameId: ID!): Boolean!
    removeBets(gameId: ID!): Boolean!
  }

  extend type Subscription {
    playerEntered(gameId: ID!, walletAddress: String!): PlayerEnteredPayload!
    playerParticipated(gameId: ID!): ParticipantPayload!
    betPlaced(gameId: ID!): Bet!
    gameStatusUpdated: GameStatus!
  }

  type ParticipantPayload {
  walletAddress: String!
  username: String!
  betAmount: Float!
  currency: String!
}

  # Response Type for createPlayer
  type CreatePlayerResponse {
    success: Boolean!
    message: String!
    player: Player
  }

  type Game {
    _id: ID!
    name: String!
    type: String!
    state: String!
    enteredPlayers: [Player!]! # Players who entered the game (but may not play)
    participants: [Player!]! # Players who actually play by placing a bet
    spectators: [Player!]! # Players who are only watching
    maxPlayers: Int!
    maxParticipants: Int! # Limit for actual players who can bet
    totalBetsAmount: Float!  # ✅ Ensure this field is defined
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
  
  type PlayerEnteredPayload {
    gameId: ID!
    walletAddress: String!
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

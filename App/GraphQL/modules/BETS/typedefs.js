const { gql } = require('apollo-server-express');

const betsTypeDefs = gql`
  scalar ObjectId

  extend type Query {
    players: [Player]
    games: [Game]
    game(id: ObjectId!): Game
  }

  extend type Mutation {
    createPlayer(walletAddress: ID!, username: String!): Player!
    createGame(name: String!, type: String!, maxPlayers: Int!, maxParticipants: Int!): Game!

    enterGame(gameId: ID!, walletAddress: ID!): Game!  # Player enters the game
    participateInGame(gameId: ID!, walletAddress: ID!): Game!  # Player actually joins (places a bet)

    saveWalletData(address: String!, balance: Float!, currency: String!): WalletResponse!
  }

  extend type Subscription {
    gameUpdated(gameId: ID!): Game!  # Updated to track both entered and participating players
    playerJoined: Player
  }

  type Player {
    walletAddress: ID!  # Using wallet address as unique ID
    username: String!
  }

  type Game {
    id: ID!
    name: String!
    type: String!
    state: String!

    enteredPlayers: [Player!]!  # Players who entered the game (but may not play)
    participants: [Player!]!  # Players who actually play by placing a bet
    spectators: [Player!]!  # Players who are only watching

    maxPlayers: Int!
    maxParticipants: Int!  # Limit for actual players who can bet
  }

  type WalletResponse {
    success: Boolean!
    message: String!
  }
`;

module.exports = betsTypeDefs;

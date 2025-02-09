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
    createGame(name: String!, type: String!, maxPlayers: Int!): Game!
    joinGame(gameId: ID!, walletAddress: ID!): Game!
    saveWalletData(address: String!, balance: Float!, currency: String!): WalletResponse!
  }

  extend type Subscription {
    gameUpdated(gameId: ID!): Game!
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
  players: [Player!]!
}

  type WalletResponse {
    success: Boolean!
    message: String!
  }
`;

module.exports = betsTypeDefs;

const { gql } = require('apollo-server-express');

const betsTypeDefs = gql`
  scalar ObjectId

  extend type Query {
    players: [Player]
    games: [Game]
    game(id: ObjectId!): Game
    getWheelSpinSelections: [Selection]
  }

  extend type Mutation {
    joinGame(gameId: ObjectId!, name: String!): Game
    createGame(name: String!): Game
    makeMove(gameId: ObjectId!, move: String!): Game
    addSelection(betAmount: Float!, totalPlayerRounds: Int!, currency: String!): AddSelectionResponse
  }

  extend type Subscription {
    playerJoined: Player
    moveMade: Game
    selectionAdded: Selection
  }

  type Player {
    _id: ObjectId!
    walletAddress: String!
    score: Int!
    gameId: ObjectId
  }

  type Game {
    _id: ObjectId!
    players: [Player]
    currentPlayer: Player
    moves: [Move]
    winner: Player
  }

  type Move {
    playerId: ObjectId!
    move: String!
  }

  type Selection {
    _id: ObjectId!
    betAmount: Float!
    totalPlayerRounds: Int!
    currency: String!
  }

  type AddSelectionResponse {
    success: Boolean!
    message: String!
    selection: Selection
  }
`;

module.exports = betsTypeDefs;

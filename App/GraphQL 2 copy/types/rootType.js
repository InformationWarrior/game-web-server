const { gql } = require('apollo-server-express');

const rootType = gql`
  scalar ObjectId

  type Query {
    players: [Player]
    games: [Game]
    game(id: ObjectId!): Game
    getWheelSpinSelections: [Selection]
  }

  type Mutation {
    joinGame(gameId: ObjectId!, name: String!): Game
    createGame(name: String!): Game
    makeMove(gameId: ObjectId!, move: String!): Game
    addSelection(betAmount: Float!, totalPlayerRounds: Int!, currency: String!): AddSelectionResponse
  }

  type Subscription {
    playerJoined: Player
    moveMade: Game
    selectionAdded: Selection
  }
`;

module.exports = rootType;

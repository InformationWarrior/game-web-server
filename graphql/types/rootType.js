const { gql } = require('apollo-server-express');

const rootType = gql`
  scalar ObjectId

  type Query {
    players: [Player]
    games: [Game]
    game(id: ObjectId!): Game
  }

  type Mutation {
    joinGame(gameId: ObjectId!, name: String!): Game
    createGame(name: String!): Game
    makeMove(gameId: ObjectId!, move: String!): Game
  }

  type Subscription {
    playerJoined: Player
    moveMade: Game
  }
`;

module.exports = rootType;

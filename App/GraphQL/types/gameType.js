const { gql } = require('apollo-server-express');

const gameType = gql`
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
`;

module.exports = gameType;

const { gql } = require('apollo-server-express');

const playerType = gql`
  type Player {
    _id: ObjectId!
    name: String!
    score: Int!
    gameId: ObjectId
  }
`;

module.exports = playerType;

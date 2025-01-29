const { gql } = require('apollo-server-express');

const rootType = gql`
  scalar ObjectId

  type Query {
    getWheelSpinSelections: [Selection]
  }

  type Mutation {
    addSelection(betAmount: Float!, totalPlayerRounds: Int!, currency: String!): AddSelectionResponse
  }

  type Subscription {
    selectionAdded: Selection
  }
`;

module.exports = rootType;

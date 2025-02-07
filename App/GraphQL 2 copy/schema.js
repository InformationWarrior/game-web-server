const { mergeResolvers, mergeTypeDefs } = require('@graphql-tools/merge');

const objectIdScalar = require('./scalars/objectIdScalar');

const rootType = require('./types/rootType');
const gameType = require('./types/gameType');
const playerType = require('./types/playerType');
const wheelSpinTypeDefs = require('./types/wheelSpin.TypeDefs');

const wheelSpinResolver = require('./resolvers/wheelSpinResolver');
const gameResolver = require('./resolvers/gameResolver');
const mutationResolver = require('./resolvers/mutationResolver');
const playerResolver = require('./resolvers/playerResolver');
const resolver = require('./resolvers/resolvers');
const subscriptionResolver = require('./resolvers/subscriptionResolver');
const queryResolver = require('./resolvers/queryResolver');

const typeDefs = mergeTypeDefs([
  rootType,
  gameType,
  playerType,
  wheelSpinTypeDefs,
]);

const resolvers = mergeResolvers([
  { ObjectId: objectIdScalar },
  wheelSpinResolver,
  gameResolver,
  playerResolver,
  queryResolver,
  mutationResolver,
  resolver,
  subscriptionResolver,
]);

module.exports = { typeDefs, resolvers };

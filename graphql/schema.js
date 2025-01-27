const { mergeResolvers, mergeTypeDefs } = require('@graphql-tools/merge');
const objectIdScalar = require('./modules/wheelSpin/scalars/objectIdScalar');
const gameType = require('./modules/wheelSpin/types/gameType');
const playerType = require('./modules/wheelSpin/types/playerType');
const rootType = require('./types/rootType');
const gameResolver = require('./modules/wheelSpin/resolvers/gameResolver');
const playerResolver = require('./modules/wheelSpin/resolvers/playerResolver');
const mutationResolver = require('./resolvers/mutationResolver');
const subscriptionResolver = require('./resolvers/subscriptionResolver');

const typeDefs = mergeTypeDefs([rootType, gameType, playerType]);
const resolvers = mergeResolvers([
  { ObjectId: objectIdScalar },
  gameResolver,
  playerResolver,
  mutationResolver,
  subscriptionResolver,
]);

module.exports = { typeDefs, resolvers };

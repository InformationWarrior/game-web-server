const { mergeResolvers, mergeTypeDefs } = require('@graphql-tools/merge');

const objectIdScalar = require('./scalars/objectIdScalar');

const rootType = require('./types/rootType');
const gameType = require('./types/gameType');
const playerType = require('./types/playerType');

const gameResolver = require('./resolvers/gameResolver');
const playerResolver = require('./resolvers/playerResolver');
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

const { mergeTypeDefs } = require('@graphql-tools/merge');

const rootTypeDefs = require('./root.typedefs');
const betsTypeDefs = require('../BETS/typedefs')
const wheelSpinTypeDefs = require('../WheelSpin/typedefs');

const typeDefs = mergeTypeDefs([
    rootTypeDefs,
    betsTypeDefs,
    wheelSpinTypeDefs,
]);

module.exports = typeDefs;
const { mergeTypeDefs } = require('@graphql-tools/merge');

const rootTypeDefs = require('./root.typedefs');
const betsTypeDefs = require('../modules/BETS/typedefs')
const wheelSpinTypeDefs = require('../modules/WheelSpin/typedefs');

const typeDefs = mergeTypeDefs([
    rootTypeDefs,
    betsTypeDefs,
    wheelSpinTypeDefs,
]);

module.exports = typeDefs;
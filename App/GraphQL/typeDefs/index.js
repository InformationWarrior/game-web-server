const { mergeTypeDefs } = require('@graphql-tools/merge');

const rootTypeDefs = require('./root.typedefs');
const wheelSpinTypeDefs = require('../WheelSpin/typedefs');

const typeDefs = mergeTypeDefs([
    rootTypeDefs,
    wheelSpinTypeDefs,
]);

module.exports = typeDefs;
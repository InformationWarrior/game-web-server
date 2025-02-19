const { mergeTypeDefs } = require('@graphql-tools/merge');

const rootTypeDefs = require('./rootTypeDefs');
const betsTypeDefs = require('./betsTypeDefs')

const typeDefs = mergeTypeDefs([
    rootTypeDefs,
    betsTypeDefs,
]);

module.exports = typeDefs;
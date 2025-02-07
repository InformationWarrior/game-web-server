const { mergeResolvers } = require('@graphql-tools/merge');

const objectIdScalar = require('../scalars/objectIdScalar');
const betsResolver = require('../BETS/resolver')
const wheelSpinResolver = require('../WheelSpin/resolver');

const resolvers = mergeResolvers([
    { ObjectId: objectIdScalar },
    betsResolver,
    wheelSpinResolver,
]);

module.exports = resolvers;

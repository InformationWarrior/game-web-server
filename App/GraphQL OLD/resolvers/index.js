const { mergeResolvers } = require('@graphql-tools/merge');

const objectIdScalar = require('../scalars/objectIdScalar');
const betsResolver = require('../modules/BETS/resolver')
const wheelSpinResolver = require('../modules/WheelSpin/resolver');

const resolvers = mergeResolvers([
    { ObjectId: objectIdScalar },
    betsResolver,
    wheelSpinResolver,
]);

module.exports = resolvers;

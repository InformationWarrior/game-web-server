const { mergeResolvers } = require('@graphql-tools/merge');

const objectIdScalar = require('../scalars/objectIdScalar');
const wheelSpinResolver = require('../WheelSpin/resolver');

const resolvers = mergeResolvers([
    { ObjectId: objectIdScalar },
    wheelSpinResolver,
]);

module.exports = resolvers;

const { mergeResolvers } = require('@graphql-tools/merge');

const objectIdScalar = require('../scalars/objectIdScalar');

// const mutationResolver = require('./mutation.resolver');
// const subscriptionResolver = require('./subscription.resolver');

const wheelSpinResolver = require('../WheelSpin/resolver');

const resolvers = mergeResolvers([
    { ObjectId: objectIdScalar },
    // mutationResolver,
    // subscriptionResolver,
    wheelSpinResolver,
]);

module.exports = resolvers;

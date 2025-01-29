const { mergeResolvers } = require('@graphql-tools/merge');

const objectIdScalar = require('../scalars/objectIdScalar');

const queryResolver = require('./query.resolver');
const mutationResolver = require('./mutation.resolver');
const subscriptionResolver = require('./subscription.resolver');

const wheelSpinResolver = require('./wheelSpin.resolver');

const resolvers = mergeResolvers([
    { ObjectId: objectIdScalar },
    queryResolver,
    mutationResolver,
    subscriptionResolver,
    wheelSpinResolver,
]);

module.exports = resolvers;

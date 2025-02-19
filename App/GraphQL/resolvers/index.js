const { mergeResolvers } = require('@graphql-tools/merge');

const objectIdScalar = require('../ObjectIdScalar');

const betsQueries = require('./BETSProject/betsQueries');
const betsMutations = require('./BETSProject/betsMutations');
const betsSubscriptions = require('./BETSProject/betsSubscriptions');

const resolvers = mergeResolvers([
    { ObjectId: objectIdScalar },

    {
        Query: {
            ...betsQueries,

        },
        Mutation: {
            ...betsMutations,

        },
        Subscription: {
            ...betsSubscriptions,

        },
    },
]);

module.exports = resolvers;




// const { mergeResolvers } = require('@graphql-tools/merge');

// const objectIdScalar = require('../ObjectIdScalar');

// // const betsQueries = require('./BETSProject/betsQueries');
// const betsMutations = require('./BETSProject/betsMutations');
// // const betsSubscriptions = require('./BETSProject/betsSubscriptions');

// // const wheelSpinQueries = require('./WheelSpin/wheelSpinQueries');
// const wheelSpinMutations = require('./WheelSpin/wheelSpinMutations');
// // const wheelSpinSubscriptions = require('./WheelSpin/wheelSpinSubscriptions');

// const resolvers = mergeResolvers([
//     // { ObjectId: objectIdScalar },

//     {
//         Mutation: {
//             ...betsMutations,
//             ...wheelSpinMutations
//         },
//     },
// ]);

// module.exports = resolvers;

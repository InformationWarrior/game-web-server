const { placeBet } = require("./services/placeBet");

const mutationResolvers = {
    Mutation: {
        placeBet: async (_, args) => {
            return await placeBet(args);
        },
    },
};

module.exports = mutationResolvers;

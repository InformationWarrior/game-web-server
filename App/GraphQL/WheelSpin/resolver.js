const queryResolvers = require("./query");
const mutationResolvers = require("./mutation");
const subscriptionResolvers = require("./subscription");

const resolvers = {
  ...queryResolvers,
  ...mutationResolvers,
  ...subscriptionResolvers,
};

module.exports = resolvers;

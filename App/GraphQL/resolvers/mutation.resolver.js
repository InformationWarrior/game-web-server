const { placeBet } = require('./wheelSpin.resolver');

const mutationResolver = {
  Mutation: {
    placeBet,
  },
};

module.exports = mutationResolver;

const addSelection = require('./wheelSpin.resolver').addSelection;

const mutationResolver = {
  Mutation: {
    addSelection,
  },
};

module.exports = mutationResolver;

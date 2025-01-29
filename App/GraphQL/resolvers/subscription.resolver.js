const selectionAdded = require('./wheelSpin.resolver').selectionAdded;
const subscriptionResolver = {
  Subscription: {
    selectionAdded,
  },
};

module.exports = subscriptionResolver;

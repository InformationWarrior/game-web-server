const { betPlaced } = require('./wheelSpin.resolver');
const subscriptionResolver = {
  Subscription: {
    betPlaced,
  },
};

module.exports = subscriptionResolver;

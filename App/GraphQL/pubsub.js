const { createPubSub } = require("@graphql-yoga/subscription");
const pubsub = createPubSub();
module.exports = pubsub;

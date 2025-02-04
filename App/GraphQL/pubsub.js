// const { PubSub } = require('graphql-subscriptions');
// const pubsub = new PubSub();
// module.exports = pubsub;


const { createPubSub } = require("@graphql-yoga/subscription");
const pubsub = createPubSub();
module.exports = pubsub;

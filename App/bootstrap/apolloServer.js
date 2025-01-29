const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const schema = require('../GraphQL/schema');

// Set up PubSub for subscriptions
const pubsub = new PubSub();

// Create an Apollo Server instance
const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => ({
        pubsub,
    }),
});

module.exports = apolloServer;

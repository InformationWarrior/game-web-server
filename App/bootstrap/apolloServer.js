const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const { typeDefs, resolvers } = require('../GraphQL/schema');

// Set up PubSub for subscriptions
const pubsub = new PubSub();

// Create an Apollo Server instance
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
        pubsub,
    }),
});

module.exports = apolloServer;

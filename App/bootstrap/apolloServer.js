const { ApolloServer } = require('apollo-server-express');
const pubsub = require('../GraphQL/pubsub');
const schema = require('../GraphQL/schema');

// Create an Apollo Server instance
const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => ({
        pubsub,
    }),
});

module.exports = apolloServer;

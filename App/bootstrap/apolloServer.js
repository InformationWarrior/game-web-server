const { ApolloServer } = require('apollo-server-express');
const pubsub = require('../GraphQL/pubsub');
const schema = require('../GraphQL/schema');

const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => ({
        pubsub,
    }),
});

module.exports = { apolloServer, pubsub };

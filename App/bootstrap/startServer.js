const { apolloServer, pubsub } = require("./apolloServer");

const setupGraphQLWS = require("./graphqlWS");

const startServers = async (httpServer) => {
  await apolloServer.start();
  const expressApp = require("./expressApp");
  apolloServer.applyMiddleware({ app: expressApp });

  console.log(`🚀 GraphQL API is available at http://localhost:5000${apolloServer.graphqlPath}`);

  setupGraphQLWS(httpServer, pubsub);
};

module.exports = startServers;

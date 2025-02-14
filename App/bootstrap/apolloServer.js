const { ApolloServer } = require('@apollo/server')
const {
  ApolloServerPluginDrainHttpServer
} = require('@apollo/server/plugin/drainHttpServer')
const schema = require('../GraphQL/schema')
const { createWebSocketServer } = require('./graphqlWs')

const createApolloServer = httpServer => {
  return new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart () {
          return {
            async drainServer () {
              createWebSocketServer(httpServer).close()
            }
          }
        }
      }
    ]
  })
}

module.exports = { createApolloServer }

require('dotenv').config()
const { createServer } = require('http')
const { createExpressApp } = require('./expressApp')
const { createApolloServer } = require('./apolloServer')
const { createWebSocketServer } = require('./graphqlWs')
const startBackgroundTasks = require("../GraphQL/Services/backgroundTasks");
const PORT = process.env.PORT || 5000

const startServer = async () => {
  const httpServer = createServer()
  const apolloServer = createApolloServer(httpServer)
  await apolloServer.start()

  const app = createExpressApp(apolloServer)

  httpServer.on('request', app)

  const subscriptionServer = createWebSocketServer(httpServer)

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 GraphQL API is available at http://localhost:${PORT}/graphql`
    )
    console.log(`Server is running on http://localhost:${PORT}/graphql`)
    startBackgroundTasks()
  })

  return {
    apolloServer,
    httpServer,
    subscriptionServer
  }
}

module.exports = startServer

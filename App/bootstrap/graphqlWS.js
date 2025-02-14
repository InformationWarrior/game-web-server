const { WebSocketServer } = require('ws')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute, subscribe } = require('graphql')
const schema = require('../GraphQL/schema')

const createWebSocketServer = httpServer => {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
  })

  return SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: () => console.log('🔗 WebSocket Connected'),
      onDisconnect: () => console.log('❌ WebSocket Disconnected')
    },
    wsServer
  )
}

module.exports = { createWebSocketServer }

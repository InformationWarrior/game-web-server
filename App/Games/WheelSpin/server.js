const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const mongoose = require('mongoose')
const http = require('http')
const { Server } = require('socket.io')
const { typeDefs, resolvers } = require('./graphql/schema')
const cors = require('cors')
const { PubSub } = require('graphql-subscriptions')

// Set up Express server
const app = express()
const server = http.createServer(app)

// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow connections from any origin
    methods: ['GET', 'POST']
  }
})

// Set up PubSub for subscriptions
const pubsub = new PubSub()

// Set up Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    io, // Pass the socket.io instance into the context
    pubsub // Pass the pubsub instance for subscriptions
  })
})

async function startServer () {
  // Wait for the Apollo server to start
  await apolloServer.start()

  // Apply Apollo middleware to Express
  apolloServer.applyMiddleware({ app })

  // Connect to MongoDB
  await mongoose.connect('mongodb://localhost:27017/graphql-real-time', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  console.log('Connected to MongoDB')

  // Enable CORS for the frontend
  app.use(cors('*'))

  // Socket.io: Emit events to clients when data is added/updated
  io.on('connection', socket => {
    console.log('New client connected')

    // Listen for player added event and broadcast it to all connected clients
    socket.on('playerJoined', player => {
      console.log(`Player joined: ${player.name}`)
      io.emit('playerJoined', player) // Emit the playerJoined event to all clients
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })

  // Start the server
  const PORT = process.env.PORT || 5000
  server.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}${apolloServer.graphqlPath}`
    )
  })
}

// Start the server
startServer()

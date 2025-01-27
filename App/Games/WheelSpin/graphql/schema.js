const { gql } = require('apollo-server-express')
const { GraphQLScalarType, Kind } = require('graphql')
const { ObjectId } = require('mongodb')
const Game = require('../models/game.js')
const Player = require('../models/player.js')

const typeDefs = gql`
  scalar ObjectId

  type Player {
    _id: ObjectId!
    name: String!
    score: Int!
    gameId: ObjectId
  }

  type Game {
    _id: ObjectId!
    players: [Player]
    currentPlayer: Player
    moves: [Move]
    winner: Player
  }

  type Move {
    playerId: ObjectId!
    move: String!
  }

  type Query {
    players: [Player]
    games: [Game]
    game(id: ObjectId!): Game
  }

  type Mutation {
    joinGame(gameId: ObjectId!, name: String!): Game
    createGame(name: String!): Game
    makeMove(gameId: ObjectId!, move: String!): Game
  }

  type Subscription {
    playerJoined: Player
    moveMade: Game
  }
`

const resolvers = {
  // Define the custom scalar type for MongoDB's ObjectId
  ObjectId: new GraphQLScalarType({
    name: 'ObjectId',
    description: 'Custom scalar type for MongoDB ObjectId',

    // Serialize the ObjectId to a string (for the client side)
    serialize (value) {
      if (value instanceof ObjectId) {
        return value.toString() // Convert ObjectId to string for GraphQL
      }
      throw new Error('Invalid ObjectId')
    },

    // Parse the incoming value (when it's passed as a string from the client)
    parseValue (value) {
      return new ObjectId(value) // Convert string to ObjectId
    },

    // Parse the AST representation of the value (for queries and mutations)
    parseLiteral (ast) {
      if (ast.kind === Kind.STRING) {
        return new ObjectId(ast.value) // Convert string literal to ObjectId
      }
      return null // Invalid literal type
    }
  }),
  Query: {
    players: async () => await Player.find(),

    games: async () => await Game.find().populate('players'),

    game: async (_, { id }) => {
      const game = await Game.findById(id).populate('players')
      if (!game) throw new Error('Game not found')
      return game
    }
  },

  Mutation: {
    // Join an existing game or create a new one
    joinGame: async (_, { gameId, name }, { io }) => {
      try {
        // Ensure `name` is not null or empty
        if (!name) {
          throw new Error('Name is required')
        }
        const game = await Game.findById(gameId)
        console.log('join game found :::::', game)

        if (!game) {
          return new Error('No available game found')
        }

        const player = new Player({ name, gameId: game._id })
        await player.save()

        game.players.push(player)
        await game.save()

        const gameData = await Game.findById(gameId).populate('players')
        // Emit the playerJoined event to notify all clients
        io.emit('playerJoined', player)

        return gameData
      } catch (error) {
        console.log('Error in join game :::::', error)
      }
    },

    // Create a new game and add the first player
    createGame: async (_, { name }) => {
      const game = new Game()
      await game.save()

      const player = new Player({ name, gameId: game._id })
      await player.save()

      game.players.push(player)
      await game.save()

      return game
    },

    // Make a move in a game
    makeMove: async (_, { gameId, move }, { io }) => {
      const game = await Game.findById(gameId).populate('players')
      if (!game) throw new Error('Game not found')

      const currentPlayer = game.players[game.currentPlayerIndex]
      const nextPlayerIndex =
        (game.currentPlayerIndex + 1) % game.players.length

      game.moves.push({ playerId: currentPlayer._id, move })
      game.currentPlayerIndex = nextPlayerIndex
      await game.save()

      // Emit event to notify all clients about the move
      io.emit('moveMade', game)

      return game
    }
  },

  Subscription: {
    playerJoined: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['PLAYER_JOINED'])
    },
    moveMade: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['MOVE_MADE'])
    }
  }
}

module.exports = { typeDefs, resolvers }

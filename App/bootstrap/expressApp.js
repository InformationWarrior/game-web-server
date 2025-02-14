const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { expressMiddleware } = require('@apollo/server/express4')

const createExpressApp = apolloServer => {
  const app = express()
  const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST']
  }
  app.use(cors(corsOptions))
  app.use(bodyParser.json())
  app.use('/graphql', expressMiddleware(apolloServer))
  return app
}

module.exports = { createExpressApp }

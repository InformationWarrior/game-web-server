
const { gql } = require('apollo-server-express');

const betsTypeDefs = gql`
  scalar ObjectId

  extend type Query {
    # Game Queries
    getGame(gameId: ID!): Game
    getAllGames: [Game]
    getActiveGames: [Game]
    getCompletedGames: [Game]
    getGamesByType(type: String!): [Game]
    getGamesByCurrency(currency: String!): [Game]
    getGamesByPlayer(walletAddress: String!): [Game]
    getUpcomingGames: [Game]
    getGameHistory(walletAddress: String!): [Game]
    getOngoingMultiplayerGames: [Game]
    getGameByRoundId(roundId: String!): Game

    # Player Queries
    getPlayer(walletAddress: String!): Player
    getAllPlayers: [Player]
    getPlayerGames(walletAddress: String!): [Game]
    getPlayerTransactions(walletAddress: String!): [Transaction]
    getTopPlayers(limit: Int!): [Player]
    getPlayerReferrals(walletAddress: String!): [Player]
    getPlayerWinRate(walletAddress: String!): Float
    getPlayerEarnings(walletAddress: String!): Float

    # Bet Queries
    getBet(betId: ID!): Bet
    getAllBets: [Bet]
    getBetsByPlayer(walletAddress: String!): [Bet]
    getBetsByCurrency(currency: String!): [Bet]
    getTotalBetsByPlayer(walletAddress: String!): Float

    # Transaction Queries
    getTransactionHistory(walletAddress: String!, limit: Int!): [Transaction]
    getTotalWinnings(walletAddress: String!): Float
    getCurrencyExchangeRate(currency: String!): Float
    exchangeRates: ExchangeRates!
  }

  extend type Mutation {
    # Game Mutations
    deleteGame(gameId: ID!): Boolean!

    # Player Mutations
    updatePlayer(walletAddress: String!, username: String, profileImage: String): Player!
    addReferral(referrerWallet: String!, referredWallet: String!): Boolean!

    # Bet Mutations
    updateBet(betId: ID!, amount: Float!): Bet!
    deleteBet(betId: ID!): Boolean!

    # Wallet & Transactions
    deposit(walletAddress: String!, amount: Float!, currency: String!): Transaction!
    withdraw(walletAddress: String!, amount: Float!, currency: String!): Transaction!
    recordTransaction(
      walletAddress: String!
      type: String!
      amount: Float!
      currency: String!
      transactionHash: String!
    ): Transaction!
  }

  extend type Subscription {
    gameUpdated(gameId: ID!): Game!
    gamePlayersUpdated(gameId: ID!): [Player!]
    playerUpdated(walletAddress: String!): Player!
    transactionAdded(walletAddress: String!): Transaction!
    playerRankUpdated(walletAddress: String!): Player!
  }

  # Types
  type Game {
    id: ID!
    name: String!
    type: String!
    entryFee: Float
    currency: String!
    state: String!
    players: [Player!]!
    spectators: [Player!]!
    maxPlayers: Int
    maxParticipants: Int
    roundId: String!
  }

  type Player {
    walletAddress: String!
    username: String
    profileImage: String
    balance: Float!
    totalWins: Int!
    totalLosses: Int!
    gamesPlayed: Int!
    rank: String
    referralCount: Int!
  }

  type Bet {
    id: ID!
    player: Player!
    game: Game!
    amount: Float!
    currency: String!
    timestamp: String!
  }

  type Transaction {
    id: ID!
    walletAddress: String!
    type: String!
    amount: Float!
    currency: String!
    transactionHash: String!
    timestamp: String!
  }

  type ExchangeRates {
    ETH: Float
    BTC: Float
    USDT: Float
    BETS: Float
  }
`;

module.exports = betsTypeDefs;
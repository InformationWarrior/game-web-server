const Player = require('../../../../models/player')
const pubsub = require('../../../pubsub')

const createPlayer = async (walletAddress, username) => {
  try {
    let player = await Player.findOne({ walletAddress })

    if (player) {
      // Update the player if already exists
      player.username = username
      console.log(
        'Received already createPlayer request:',
        walletAddress,
        username
      )
      await player.save()
      const allPlayers = await getPlayers()
      console.log('All players:', allPlayers)

      pubsub.publish('PLAYER_JOINED', { playerJoined: allPlayers })
      return player
    } else {
      // Create a new player
      player = new Player({ walletAddress, username })
      console.log('Received createPlayer request:', walletAddress, username)
      await player.save()
      const allPlayers = await getPlayers()
      pubsub.publish('PLAYER_JOINED', { playerJoined: allPlayers })
      return player
    }
  } catch (error) {
    throw new Error('Error creating player: ' + error.message)
  }
}

const getPlayers = async () => {
  return await Player.find()
}

module.exports = {
  createPlayer,
  getPlayers
}

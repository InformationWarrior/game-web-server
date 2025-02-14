const dbConnect = require('./App/config/dbConnect')
const startServers = require('./App/bootstrap/startServer');

(async () => {
  try {
    await dbConnect()
    await startServers()
  } catch (error) {
    console.error('❌ Error starting the server:', error)
  }
})()

require("dotenv").config();
const http = require("http");
const expressApp = require("./App/bootstrap/expressApp");
const dbConnect = require("./App/config/dbConnect");
const startServers = require("./App/bootstrap/startServer");
const PORT = process.env.PORT || 5000;

const server = http.createServer(expressApp);

(async () => {
  try {
    await dbConnect();
    await startServers(server);

    server.listen(PORT, () => {
      console.log(`🚀 Server is up and running at http://localhost:${PORT}...`);
    });

  } catch (error) {
    console.error("❌ Error starting the server:", error);
  }
})();

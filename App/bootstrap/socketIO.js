const { Server } = require("socket.io");

const setupSocketIO = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔗 New Socket.io client connected");

    socket.on("playerJoined", (player) => {
      console.log(`🎮 Player joined: ${player.name}`);
      io.emit("playerJoined", player);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected");
    });
  });

  console.log("✅ Socket.io server is running...");
};

module.exports = setupSocketIO;

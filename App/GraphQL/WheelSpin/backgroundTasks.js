const gameStateUpdate = require("./gameStateUpdate")

const startBackgroundTasks = () => {
    console.log("✅ Starting background tasks...");
    gameStateUpdate();
};

module.exports = startBackgroundTasks;

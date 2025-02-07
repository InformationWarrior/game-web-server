const gameStateUpdate = require("./services/gameStateUpdate")

const startBackgroundTasks = () => {
    console.log("✅ Starting background tasks...");
    gameStateUpdate();
};

module.exports = startBackgroundTasks;

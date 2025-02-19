const gameStateUpdate = require("./gameStateUpdate")

const startBackgroundTasks = () => {
    console.log("✅ Background tasks running...");
    gameStateUpdate();
};

module.exports = startBackgroundTasks;

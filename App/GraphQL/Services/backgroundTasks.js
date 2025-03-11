const gameStateUpdate = require("../Services/StatePattern/gameStateUpdate");

const startBackgroundTasks = () => {
    console.log("✅ Background tasks running...");
    gameStateUpdate();
};

module.exports = startBackgroundTasks;

const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/use/ws");
const { schema, pubsub } = require("./apolloServer");

const setupGraphQLWS = (httpServer) => {
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/graphql",
    });

    useServer(
        {
            schema,
            context: () => ({ pubsub }),
            onConnect: () => console.log("🔗 WebSocket Connected"),
            onDisconnect: () => console.log("❌ WebSocket Disconnected"),
        },
        wsServer
    );
    console.log("✅ GraphQL WebSocket server is running...");
};

module.exports = setupGraphQLWS;

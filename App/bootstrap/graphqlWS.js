const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/use/ws");
const { schema } = require("../GraphQL/schema");

const setupGraphQLWS = (httpServer, pubsub) => {
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/graphql",
    });

    useServer({
        schema,
        context: () => (
            { pubsub })
    }, wsServer);

    console.log("✅ GraphQL WebSocket server is running...");
};

module.exports = setupGraphQLWS;

const createServerConfig = require("./serverConfig");

const serverConfig = require("../src/config/serverConfig");

const server = createServerConfig(serverConfig);

server.start();
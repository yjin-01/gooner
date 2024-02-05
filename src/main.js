const serverConfig = require("../src/config/serverConfig");
const { createServerConfig,configureRoutes } = require('./serverConfig');
const routes = require("./route");

// 서버 구성 생성
const server = createServerConfig(serverConfig, routes);

// 서버 실행
server.start();
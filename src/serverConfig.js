const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const WebSocket = require('./chat');

// 추가적인 미들웨어 여기에 추가
function configureMiddleware(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());
}

// 추가적인 라우트 모듈을 여기에 추가
function configureRoutes(app, route) {
  app.use("/apis", route);
}

function createServerConfig(config, route) {
  const app = express();

  const port = config.PORT || 3000;

  configureMiddleware(app);

  configureRoutes(app, route);

  function start() {
    const socket = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    WebSocket(socket);
  }

  return { start };
}

module.exports = {
  createServerConfig,
  configureMiddleware,
  configureRoutes,
};


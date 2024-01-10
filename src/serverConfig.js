const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const route = require("./route");

function createServerConfig(config) {
  const app = express();

  const port = config.PORT || 3000;

  configureMiddleware(app);
  configureRoutes(app);

  function configureMiddleware(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(helmet());
  }

  function configureRoutes(app) {
    app.use("/apis", route);
    // 추가적인 라우트 모듈을 여기에 추가할 수 있습니다.
  }

  function start() {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  return { start };
}

module.exports = createServerConfig;

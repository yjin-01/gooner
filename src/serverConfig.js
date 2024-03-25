const express = require("express");
const cors = require("cors");
const prometheus = require("prom-client"); // Prometheus 모듈 추가
const helmet = require("helmet");
// const schedulerTask = require("./scheduler");
const WebSocket = require('./chat');

// 추가적인 미들웨어 여기에 추가
function configureMiddleware(app) {

  // Prometheus 메트릭 레지스트리 생성
  const register = new prometheus.Registry();

// 기본 메트릭을 레지스트리에 등록
  prometheus.collectDefaultMetrics({ register });

  const customMetric = new prometheus.Gauge({
    name : "custom_metric",
    help : "This is a custom metric",
    registers : [register],
  })

  app.get("/update-metric", (req,res) =>{
    customMetric.set(Math.random() * 100);

    res.send("Metric updated successfully");
  })

// Prometheus 미들웨어를 사용하여 메트릭을 노출
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (ex) {
      res.status(500).end(ex);
    }
  });
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

  // 서버 시작시 스케줄러 동작
  // schedulerTask.update_match_result();

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


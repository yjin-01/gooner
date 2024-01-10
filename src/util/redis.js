const redis = require("redis");
const { redisConfig } = require("../config/db/redisConfig");
const logger = require("../utils/logger");

const redisClient = redis.createClient({
  socket: {
    host: redisConfig.host,
    port: redisConfig.port,
  },
  //   password: redisConfig.password,
  legacyMode: true,
});
redisClient.on("connect", () => logger.info("Connected to Redis"));
redisClient.on("error", (err) => console.error("Redis Client Error" + err));
redisClient.connect().then();

const redisCli = redisClient.v4;

module.exports = redisCli;

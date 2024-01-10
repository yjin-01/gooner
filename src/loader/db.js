const mysql2 = require("mysql2/promise");
const genericPool = require("generic-pool");

const { mysqlConfig } = require("../config/serverConfig");
const logger = require("../util/logger");

// 커넥션 풀 생성
const pool = genericPool.createPool({
  create: async function () {
    try {
      const connection = await mysql2.createConnection(mysqlConfig);
      return connection;
    } catch (err) {
      console.error(err);
      logger.error("pool Error : ", err.stack);
    }
  },
  destroy: function (connection) {
    return connection.end();
  },
});

module.exports = {
  // 풀에서 커넥션 획득
  getConnection: function () {
    return pool.acquire();
  },

  // 사용이 끝난 커넥션을 풀에 반환
  releaseConnection: function (connection) {
    return pool.release(connection);
  },

  // 트랜잭션 시작
  beginTransaction: async function (connection) {
    await connection.beginTransaction();
  },

  // 트랜잭션 커밋
  commitTransaction: async function (connection) {
    await connection.commit();
  },

  // 트랜잭션 롤백
  rollbackTransaction: async function (connection) {
    await connection.rollback();
  },
};

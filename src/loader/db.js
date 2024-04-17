// Version2
const mysql2 = require('mysql2/promise');

const { mysqlConfig } = require('../config/serverConfig');
const logger = require('../util/logger');

// 커넥션 풀 생성

const pool = mysql2.createPool(mysqlConfig);

module.exports = {
  // 문자열 이스케이프
  getEscape: async function (text) {
    return mysql2.escape(text);
  },
  // 풀에서 커넥션 획득
  getConnection: async function () {
    try {
      return await pool.getConnection();
    } catch (err) {
      logger.error('Error getConnection:', err.stack);
      throw err;
    }
  },

  // 사용이 끝난 커넥션을 풀에 반환
  releaseConnection: async function (connection) {
    try {
      return pool.releaseConnection(connection);
    } catch (err) {
      logger.error('Error getConnection:', err.stack);
      throw err;
    }
  },

  // 트랜잭션 시작
  beginTransaction: async function (connection) {
    try {
      await connection.beginTransaction();
    } catch (err) {
      logger.error('Error beginning transaction:', err.stack);
      throw err;
    }
  },

  // 트랜잭션 커밋
  commitTransaction: async function (connection) {
    try {
      await connection.commit();
    } catch (err) {
      logger.error('Error committing transaction:', err.stack);
      throw err;
    }
  },

  // 트랜잭션 롤백
  rollbackTransaction: async function (connection) {
    try {
      await connection.rollback();
    } catch (err) {
      logger.error('Error rolling back transaction:', err.stack);
      throw err;
    }
  },
};

// Version1
// const mysql2 = require('mysql2/promise');
// const genericPool = require('generic-pool');

// const { mysqlConfig } = require('../config/serverConfig');
// const logger = require('../util/logger');

// // 커넥션 풀 생성
// const pool = genericPool.createPool(
//   {
//     create: async function () {
//       try {
//         const connection = await mysql2.createConnection(mysqlConfig);
//         return connection;
//       } catch (err) {
//         logger.error('Error creating connection:', err.stack);
//         throw err;
//       }
//     },
//     destroy: function (connection) {
//       return connection.end();
//     },
//     log: true,
//   },
//   {
//     max: 20, // 풀 최대 사이즈
//     min: 3, // 풀 최소 사이즈
//   },
// );

// module.exports = {
//   // 문자열 이스케이프
//   getEscape: async function (text) {
//     return mysql2.escape(text);
//   },
//   // 풀에서 커넥션 획득
//   getConnection: async function () {
//     try {
//       return await pool.acquire();
//     } catch (err) {
//       logger.error('Error getConnection:', err.stack);
//       throw err;
//     }
//   },

//   // 사용이 끝난 커넥션을 풀에 반환
//   releaseConnection: async function (connection) {
//     return pool.release(connection).catch((err) => {
//       // 풀에서 연결을 반환하는 동안 오류가 발생한 경우 여기서 처리
//       logger.error('Error releasing connection:', err.stack);
//       throw err;
//     });
//   },

//   // 트랜잭션 시작
//   beginTransaction: async function (connection) {
//     try {
//       await connection.beginTransaction();
//     } catch (err) {
//       logger.error('Error beginning transaction:', err.stack);
//       throw err;
//     }
//   },

//   // 트랜잭션 커밋
//   commitTransaction: async function (connection) {
//     try {
//       await connection.commit();
//     } catch (err) {
//       logger.error('Error committing transaction:', err.stack);
//       throw err;
//     }
//   },

//   // 트랜잭션 롤백
//   rollbackTransaction: async function (connection) {
//     try {
//       await connection.rollback();
//     } catch (err) {
//       logger.error('Error rolling back transaction:', err.stack);
//       throw err;
//     }
//   },
// };

const db = require("../loader/db");
const logger = require("../util/logger");

module.exports = {
  // 모든 유저 검색
  getAllUser: async () => {
    let connection;
    try {
      const query = `SELECT * FROM user`;
      connection = await db.getConnection();
      const results = await connection.query(query);

      return results[0];
    } catch (err) {
      logger.error("model Error : ", err.stack);
      console.error("Error", err.message);
      return err;
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },
};
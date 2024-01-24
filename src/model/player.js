const db = require('../loader/db');
const logger = require('../util/logger');

module.exports = {
  // 모든 플레이어 검색
  getAllPlayer: async () => {
    let connection;
    try {
      const query = `SELECT * FROM players`;
      connection = await db.getConnection();

      const users = await executeQuery(connection, query);

      return users[0];
    } catch (err) {
      logger.error('model Error : ', err.stack);
      console.error('Error', err.message);
      return err;
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },

  // 특정 선수단의 플레이어 검색
  getOnePlayer: async (teamId, playerId) => {
    let connection;

    try {
      const query = `
          SELECT sb.*, po1.position_name AS main_position, po2.position_name AS sub_position1
                , po3.position_name AS sub_position, c.contract_start_date, c.contract_end_date  
          FROM (
            SELECT p.* 
            FROM players p 
            WHERE p.player_id = ${playerId}
          ) sb
          LEFT JOIN positions po1 ON po1.position_id = sb.position_id1  
          LEFT JOIN positions po2 ON po2.position_id = sb.position_id2
          LEFT JOIN positions po3 ON po3.position_id = sb.position_id3
          LEFT JOIN contracts c ON c.player_id = sb.player_id AND c.club_id = ${teamId}
          ORDER BY c.contract_start_date DESC 
          LIMIT 1
      `;

      connection = await db.getConnection();

      const player = await executeQuery(connection, query);

      return player[0][0];
    } catch (err) {
      logger.error('getOnePlayer Model Error : ', err.stack);
      console.error('Error', err.message);
      return err;
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },

  getTeamPlayer: async (teamId) => {
    let connection;
    try {
      const query = `
          SELECT p.*, sb.back_number
              , po1.category, po1.position_name as main_position, po1.initial
          FROM (
            SELECT *
            FROM contracts c 
            WHERE c.club_id = ${teamId}
              AND c.contract_status = 1
          ) sb
          LEFT JOIN players p ON p.player_id = sb.player_id
          LEFT JOIN positions po1 ON po1.position_id  = p.position_id1 
      `;
      connection = await db.getConnection();

      const player = await executeQuery(connection, query);

      return player[0];
    } catch (err) {
      logger.error('getMyTeamPlayer Model Error : ', err.stack);
      console.error('Error', err.message);
      return err;
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },

  // 시즌별 선수단 검색
  getTeamPlayerByLeagueSeason: async (teamId, season) => {
    let connection;
    try {
      const query = `
        SELECT p.* , sb.back_number
        , po1.category, po1.position_name as main_position, po1.initial
        FROM (
          SELECT *
          FROM contracts c 
          WHERE c.club_id = ${teamId}
            AND c.contract_end_date >= "${season.league_start_date}"
            AND c.contract_start_date <= "${season.league_end_date}"
        )sb
        LEFT JOIN players p ON p.player_id = sb.player_id
        LEFT JOIN positions po1 ON po1.position_id = p.position_id1            
    `;

      console.log(query);
      connection = await db.getConnection();

      const player = await executeQuery(connection, query);

      return player[0];
    } catch (err) {
      logger.error('getTeamPlayerByLeagueSeason Model Error : ', err.stack);
      console.error('Error', err.message);
      return err;
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },
};

async function executeQuery(connection, query) {
  try {
    const results = await connection.query(query);
    return results;
  } catch (error) {
    throw error;
  }
}

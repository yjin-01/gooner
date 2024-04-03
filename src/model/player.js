const db = require('../loader/db');
const logger = require('../util/logger');
const season = require('./season');

module.exports = {
  // 모든 플레이어 검색
  getAllPlayer: async () => {
    let connection;
    try {
      const query = `SELECT * FROM persons`;
      connection = await db.getConnection();
      const users = await connection.query(query);

      return users[0];
    } catch (err) {
      logger.error('getAllPlayer model Error : ', err.stack);
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
          SELECT sb.player_id, sb.player_name, sb.birth_date, sb.stature
                , sb.weight, sb.back_number, sb.image_url
                , po1.position_name AS main_position, po2.position_name AS sub_position1
                , po3.position_name AS sub_position2
                , c1.name AS nationality1, c2.name AS nationality2, c3.name AS nationality3
                , con.contract_start_date, con.contract_end_date  
          FROM (
            SELECT p.* 
            FROM persons p 
            WHERE p.player_id = ${playerId}
          ) sb
          LEFT JOIN positions po1 ON po1.position_id = sb.position_id1  
          LEFT JOIN positions po2 ON po2.position_id = sb.position_id2
          LEFT JOIN positions po3 ON po3.position_id = sb.position_id3
          LEFT JOIN country c1 ON c1.code = sb.country_code1
          LEFT JOIN country c2 ON c2.code = sb.country_code2
          LEFT JOIN country c3 ON c3.code = sb.country_code3
          LEFT JOIN contracts con ON con.player_id = sb.player_id AND con.club_id = ${teamId}
          ORDER BY con.contract_start_date DESC 
          LIMIT 1
      `;

      connection = await db.getConnection();

      const player = await connection.query(query);

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

  getOnePlayerV2: async ({ playerId }) => {
    let connection;

    try {
      const query = `
          SELECT sb.player_id, sb.name as player_name, sb.date_of_birth as birth_date, sb.height
                , sb.weight, sb.image_path as player_image
                , po1.name AS position
                , c1.name AS nationality
          FROM (
            SELECT p.* 
            FROM players p 
            WHERE p.player_id = ${playerId}
          ) sb
          LEFT JOIN positions_v2 po1 ON po1.position_id = sb.position_id
          LEFT JOIN country_v2 c1 ON c1.country_id = sb.country_id
      `;

      connection = await db.getConnection();

      const player = await connection.query(query);

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

  // 현재 시즌 선수단 조회
  getTeamPlayer: async (teamId) => {
    let connection;
    try {
      const query = `
          SELECT p.player_id, p.player_name, p.image_url, sb.back_number
                , po1.category, po1.initial as main_position
          FROM (
            SELECT *
            FROM contracts c 
            WHERE c.club_id = ${teamId}
              AND c.contract_status = 1
          ) sb
          LEFT JOIN persons p ON p.player_id = sb.player_id
          LEFT JOIN positions po1 ON po1.position_id  = p.position_id1 
      `;
      connection = await db.getConnection();

      const player = await connection.query(query);

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

  // TODO
  getTeamPlayerV2: async (teamId) => {
    let connection;
    try {
      const query = `
          SELECT p.player_id, p.player_name, p.image_url, sb.back_number
                , po1.category, po1.initial as main_position
          FROM (
            SELECT *
            FROM contracts c 
            WHERE c.club_id = ${teamId}
              AND c.contract_status = 1
          ) sb
          LEFT JOIN persons p ON p.player_id = sb.player_id
          LEFT JOIN positions po1 ON po1.position_id  = p.position_id1 
      `;
      connection = await db.getConnection();

      const player = await connection.query(query);

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
  getTeamPlayerByLeagueSeason: async (
    teamId,
    leagueStartDate,
    leagueEndDate,
  ) => {
    let connection;
    try {
      const query = `
        SELECT p.player_id, p.player_name, p.image_url, sb.back_number
              , po1.category, po1.initial as main_position
        FROM (
          SELECT *
          FROM contracts c 
          WHERE c.club_id = ${teamId}
            AND c.contract_end_date >= "${leagueStartDate}"
            AND c.contract_start_date <= "${leagueEndDate}"
        )sb
        LEFT JOIN persons p ON p.player_id = sb.player_id
        LEFT JOIN positions po1 ON po1.position_id = p.position_id1            
    `;
      connection = await db.getConnection();

      const player = await connection.query(query);

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

  getTeamPlayerByLeagueSeasonV2: async ({
    teamId,
    seasonId,
    positionId,
    keyword,
  }) => {
    let connection;

    try {
      const query = `
        SELECT p.player_id
              , p.name as player_name
              , p.image_path as player_image
              , p.position_id
              , po1.category
              , po1.initial
        FROM (
          SELECT *
          FROM squads s
          WHERE s.team_id = ${teamId}
            ${seasonId ? `AND s.season_id = ${seasonId}` : ''}
        )sb
        LEFT JOIN players p ON p.player_id = sb.player_id
        LEFT JOIN positions_v2 po1 ON po1.position_id = p.position_id
        WHERE 1 = 1
          ${positionId ? `AND p.position_id = ${positionId}` : ''}
          ${keyword ? `AND p.name LIKE "%${keyword}%"` : ''}
        GROUP BY p.player_id

  `;
      connection = await db.getConnection();

      const player = await connection.query(query);

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

  // 주목할 만한 선수
  getNotablePlayer: async () => {},
};

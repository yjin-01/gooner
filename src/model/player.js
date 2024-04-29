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

  // 선수 상세 조회
  getOnePlayerV2: async ({ playerId }) => {
    let connection;

    try {
      const query = `
          SELECT sb.player_id
                , sb.display_name as player_name
                , sb.date_of_birth as birth_date
                , sb.height
                , sb.weight
                , sb.image_path as player_image_url
                , po1.name AS position
                , po1.initial AS position_initial
                , po1.category AS position_category
                , c1.name AS nationality
                , c1.image_path AS nationality_image_url
          FROM (
            SELECT p.* 
                  , IFNULL( p.detailed_position_id, p.position_id ) as join_position_id
            FROM players p 
            WHERE p.player_id = ${playerId}
          ) sb
          LEFT JOIN positions_v2 po1 ON po1.position_id = sb.join_position_id
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

  // 선수 최신 등번호 조회
  getPlayerJerseyNumber: async ({ teamId, playerId }) => {
    let connection;

    try {
      const query = `
                SELECT s.player_id, s.jersey_number
                FROM squads s               
                WHERE s.team_id = ${teamId} 
                  AND s.player_id = ${playerId}
                ORDER BY s.squad_id DESC
                LIMIT 1
            `;

      connection = await db.getConnection();

      const squad = await connection.query(query);

      return squad[0][0];
    } catch (err) {
      logger.error('getPlayerJerseyNumber Model Error : ', err.stack);
      console.error('Error', err.message);
      return err;
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },

  // 시즌별 선수단 검색
  // [ 조건 ]
  // 1. 시즌ID가 없는 경우 모든 선수의 가장 최근 시즌 계약 정보가 나와야함
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
                  , sb.season_id
                  , p.display_name as player_name
                  , p.image_path as player_image_url
                  , sb.jersey_number
                  , sb.position_id
                  , po1.category as position_category
                  , po1.initial as position_initial
            FROM (
              SELECT s.*
              FROM squads s               
              ${
                !seasonId
                  ? `
                    INNER JOIN 
                    ( SELECT s2.player_id, MAX ( s2.season_id ) as season_id
                      FROM squads s2 
                      GROUP BY s2.player_id 
                    ) a ON a.player_id = s.player_id AND a.season_id = s.season_id
                    `
                  : ''
              }
              WHERE s.team_id = ${teamId}
              ${seasonId ? `AND s.season_id = ${seasonId}` : ''}
            )sb
            LEFT JOIN players p ON p.player_id = sb.player_id
            LEFT JOIN positions_v2 po1 ON po1.position_id = sb.position_id
            WHERE 1 = 1
              ${positionId ? `AND p.position_id = ${positionId}` : ''}
              ${keyword ? `AND p.name LIKE "%${keyword}%"` : ''}       
      `;

      connection = await db.getConnection();

      const players = await connection.query(query);

      return players[0];
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

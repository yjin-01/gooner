const db = require('../loader/db');
const logger = require('../util/logger');

module.exports = {
  // 팀별 참여 시즌 목록 조회
  getAllSeasonByTeamIdV2: async ({ teamId }) => {
    let connection;

    try {
      const query = `
          SELECT s2.season_id, s2.name AS season
            FROM(
              SELECT *
              FROM standing s 
              WHERE participant_id = ${teamId}
            ) sb
          LEFT JOIN seasons_v2 s2 on s2.season_id  = sb.season_id
          ORDER BY s2.season_id ASC
      `;

      connection = await db.getConnection();

      const season = await connection.query(query);

      return season[0];
    } catch (err) {
      logger.error('getAllSeasonByTeamId Model Error : ', err.stack);
      console.error('Error', err.message);
      throw err;
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },

  // 팀의 현재 진행중인 리그시즌 조회
  getCurrentLeagueSeasonByTeamId: async ({ teamId }) => {
    let connection;

    try {
      const query = `
          SELECT l.league_id
                , l.name as league_name
                , l.short_code
                , l.image_path as league_image_url
                , sb.season_id
                , sb.name AS season
                , s2.participant_id as team_id
            FROM(
              SELECT *
              FROM seasons_v2 s 
              WHERE is_current = 1
            ) sb
          LEFT JOIN leagues_v2 l on l.league_id = sb.league_id
          INNER JOIN standing s2 on s2.season_id = sb.season_id 
            AND s2.participant_id = ${teamId}
      `;

      connection = await db.getConnection();

      const season = await connection.query(query);

      return season[0];
    } catch (err) {
      logger.error('getCurrentLeagueSeasonByTeamId Model Error : ', err.stack);
      console.error('Error', err.message);
      throw err;
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },

  getSeasonRank: async ({ seasonId }) => {
    let connection;

    try {
      const query = `
          SELECT sb.standing_id
                , sb.position
                , sb.points
                , sb.win
                , sb.loss
                , sb.draw
                , sb.goal_difference
                , t.team_id
                , t.name as team_name
                , t.image_path as team_image_url
                , t.short_code
            FROM(
              SELECT *
              FROM standing s 
              WHERE season_id = ${seasonId}
            ) sb
          LEFT JOIN teams t on t.team_id = sb.participant_id
          ORDER BY sb.position ASC
      `;

      connection = await db.getConnection();

      const rank = await connection.query(query);

      return rank[0];
    } catch (err) {
      logger.error('getSeasonRank Model Error : ', err.stack);
      console.error('Error', err.message);
      throw err;
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },
};

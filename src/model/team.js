const db = require('../loader/db');
const logger = require('../util/logger');
const teamQuery = require('../queries/teamQueries');

module.exports = {
  // 팀 정보 조회
  getOneTeamV2: async ({ teamId }) => {
    let connection;

    try {
      const query = `
        SELECT sb.team_id
            , sb.name as team_name
            , sb.founded
            , sb.image_path as team_image_url
            , sb.short_code
            , sb.manager_name
            , p.display_name as captain_player_name
            , v.name as venue_name
            , c.name as city_name
            , sb.official_web_url
            , sb.sns_facebook
            , sb.sns_x
            , sb.sns_instagram
        FROM (
            SELECT *
            FROM teams t 
            WHERE t.team_id = ${teamId}
        ) sb
        LEFT JOIN venues v ON v.venue_id = sb.venue_id
        LEFT JOIN players p ON p.player_id = sb.captain_player_id
        LEFT JOIN city_v2 c ON c.city_id = v.city_id
    `;

      connection = await db.getConnection();

      const team = await connection.query(query);

      return team[0][0];
    } catch (err) {
      logger.error('getOneTeam Model Error : ', err.stack);
      console.error('Error', err.message);
      return err;
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },
};

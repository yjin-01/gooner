const db = require('../loader/db');
const logger = require('../util/logger');

module.exports = {
  // 팀 정보 조회
  getOneTeam: async (teamId) => {
    let connection;

    try {
      const query = `
        SELECT sb.club_id, sb.club_name, sb.official_name, sb.foundation_date, sb.image_url, sb.team_nickname
            , p1.player_id as manager_id, p1.player_name as manager
            , p2.player_id as captain_id, p2.player_name as captain
            , s.stadium_name 
        FROM (
            SELECT *
            FROM clubs c 
            WHERE c.club_id = ${teamId}
        ) sb
        LEFT JOIN city ci ON ci.id = sb.hometown
        LEFT JOIN stadiums s ON s.stadium_id = sb.stadium_id
        LEFT JOIN persons p1 ON p1.player_id = sb.manager
        LEFT JOIN persons p2 ON p2.player_id = sb.captain
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


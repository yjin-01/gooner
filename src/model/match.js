const db = require('../loader/db');
const logger = require('../util/logger');

module.exports = {
  // 팀 정보 조회
  getMatchByTeamAndMonth: async (teamId, startDate, endDate) => {
    let connection;

    try {
      const query =
        `
        SELECT sb.match_id, c1.club_name as home_team_name, c1.image_url as home_team_image
            , c2.club_name as away_team_name, c2.image_url as away_team_image
            , sb.match_date, sb.home_score, sb.away_score, sb.round, sb.is_finished, s.stadium_name, l.league_image_url 
        FROM(
            SELECT *
            FROM` +
        '`match`' +
        `m 
            WHERE m.match_date BETWEEN DATE_SUB('${startDate}', INTERVAL 7 DAY) AND DATE_ADD('${endDate}', INTERVAL 7 DAY)
                AND (m.home_team_id = ${teamId} or m.away_team_id = ${teamId})
        ) sb
        LEFT JOIN clubs c1 ON c1.club_id = sb.home_team_id #and c1.club_id = sb.away_team_id
        LEFT JOIN clubs c2 ON c2.club_id = sb.away_team_id
        LEFT JOIN stadiums s ON s.stadium_id = sb.match_place
        LEFT JOIN season_by_leagues sbl ON sbl.league_id = sb.season_by_league_id
        LEFT JOIN leagues l ON l.league_id = sbl.league_id 
      `;

      connection = await db.getConnection();

      const matchList = await connection.query(query);

      return matchList[0];
    } catch (err) {
      logger.error('getMatchByTeamAndMonth Model Error : ', err.stack);
      console.error('Error', err.message);
      return err;
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },
};
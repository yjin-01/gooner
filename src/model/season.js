const db = require('../loader/db');
const logger = require('../util/logger');

module.exports = {
  // 리그별 시즌 정보
  getSeasonByLeague: async (leagueId, leagueSeason) => {
    let connection;

    try {
      const query = `
        SELECT DATE_FORMAT(sbl.league_start_date,'%Y-%m-%d') AS league_start_date
            , DATE_FORMAT(sbl.league_end_date, '%Y-%m-%d') AS league_end_date
        FROM season_by_leagues sbl 
        WHERE sbl.league_id = ${leagueId}
            AND sbl.league_season = "${leagueSeason}"    
      `;

      connection = await db.getConnection();

      const season = await connection.query(query);

      return season[0][0];
    } catch (err) {
      logger.error('getSeasonByLeague Model Error : ', err.stack);
      console.error('Error', err.message);
      return err;
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },

  // 팀별 시즌 목록 조회
  getAllSeasonByTeamId: async (teamId) => {
    let connection;

    try {
      const query = `
          SELECT sbl.league_season 
            FROM(
            SELECT *
            FROM league_participating_clubs_by_season lpcbs 
            WHERE club_id = ${teamId}
            ) sb
          LEFT JOIN season_by_leagues sbl on sbl.season_by_league_id  = sb.season_by_league_id
          GROUP BY sbl.league_season 
      `;

      connection = await db.getConnection();

      const season = await connection.query(query);

      return season[0];
    } catch (err) {
      logger.error('getAllSeasonByTeamId Model Error : ', err.stack);
      console.error('Error', err.message);
      return err;
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },
};

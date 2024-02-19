const db = require('../loader/db');
const logger = require('../util/logger');

module.exports = {
  // 팀 정보 조회
  getMatchByTeamAndSeason: async (teamId, seasonStartDate, seasonEndDate) => {
    let connection;

    try {
      const query =
        `
        SELECT sb.match_id, c1.club_id as home_team_id, c1.club_name as home_team_name, c1.image_url as home_team_image
            , c2.club_id as away_team_id, c2.club_name as away_team_name, c2.image_url as away_team_image
            , sb.match_date, sb.home_score, sb.away_score, sb.round, sb.is_finished, s.stadium_name, l.league_image_url 
        FROM(
            SELECT *
            FROM` +
        '`match`' +
        `m 
            WHERE m.match_date BETWEEN "${seasonStartDate}" AND "${seasonEndDate}"
                AND (m.home_team_id = ${teamId} or m.away_team_id = ${teamId})
        ) sb
        LEFT JOIN clubs c1 ON c1.club_id = sb.home_team_id #and c1.club_id = sb.away_team_id
        LEFT JOIN clubs c2 ON c2.club_id = sb.away_team_id
        LEFT JOIN stadiums s ON s.stadium_id = sb.match_place
        LEFT JOIN season_by_leagues sbl ON sbl.season_by_league_id = sb.season_by_league_id
        LEFT JOIN leagues l ON l.league_id = sbl.league_id 
      `;

      connection = await db.getConnection();

      const matchList = await connection.query(query);

      return matchList[0];
    } catch (err) {
      logger.error('getMatchByTeamAndSeason Model Error : ', err.stack);
      console.error('Error', err.message);
      return err;
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },

  // 상대 전적 조회

  checkRelativePerformance: async () => {
    let connection;

    try {
      const query = `
        SELECT * 
        FROM match;
      `;

      connection = await db.getConnection();

      const matchList = await connection.query(query);

      return matchList[0];
    } catch (err) {
      logger.error('checkRelativePerformance Model Error : ', err.stack);
      console.error('Error', err.message);
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },

  // 라인업 - 1시간전

  getTeamLineUp: async () => {},

  // 예정 경기 조회
  getUpcomingMatch: async (teamId) => {
    let connection;

    try {
      const query =
        `
      SELECT sb.match_id, c1.club_id as home_team_id, c1.club_name as home_team_name, c1.team_nickname as home_team_nickname, c1.image_url as home_team_image
            , c2.club_id as away_team_id, c2.club_name as away_team_name, c2.team_nickname as away_team_nickname, c2.image_url as away_team_image
            , sb.match_date, s.stadium_name, l.league_image_url 
      FROM (
          SELECT *
          FROM` +
        '`match`' +
        `m 
            WHERE  (m.home_team_id = 2 OR m.away_team_id = ${teamId})
              AND m.match_date >= NOW()
          ORDER BY match_date ASC
          LIMIT 5
      ) sb
      LEFT JOIN clubs c1 ON c1.club_id = sb.home_team_id #and c1.club_id = sb.away_team_id
      LEFT JOIN clubs c2 ON c2.club_id = sb.away_team_id
      LEFT JOIN stadiums s ON s.stadium_id = sb.match_place
      LEFT JOIN season_by_leagues sbl ON sbl.season_by_league_id = sb.season_by_league_id
      LEFT JOIN leagues l ON l.league_id = sbl.league_id 
      `;

      connection = await db.getConnection();

      const matchList = await connection.query(query);

      return matchList[0];
    } catch (err) {
      logger.error('getUpcomingMatch Model Error : ', err.stack);
      console.error('Error', err.message);
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },

  // 최근 경기 결과 조회
  getRecentlyMatch: async (teamId) => {
    let connection;

    try {
      const query =
        `
        SELECT sb.match_id, c1.club_id as home_team_id, c1.club_name as home_team_name, c1.team_nickname as home_team_nickname, c1.image_url as home_team_image
              , c2.club_id as away_team_id, c2.club_name as away_team_name, c2.team_nickname as away_team_nickname, c2.image_url as away_team_image
              , sb.match_date, sb.home_score, sb.away_score, sb.round, sb.is_finished, s.stadium_name, l.league_image_url 
        FROM (
            SELECT *
            FROM` +
        '`match`' +
        `m 
              WHERE ( m.home_team_id = 2 OR m.away_team_id = ${teamId} )
                AND m.is_finished = 1
            ORDER BY match_date DESC
            LIMIT 1
        ) sb
        LEFT JOIN clubs c1 ON c1.club_id = sb.home_team_id #and c1.club_id = sb.away_team_id
        LEFT JOIN clubs c2 ON c2.club_id = sb.away_team_id
        LEFT JOIN stadiums s ON s.stadium_id = sb.match_place
        LEFT JOIN season_by_leagues sbl ON sbl.season_by_league_id = sb.season_by_league_id
        LEFT JOIN leagues l ON l.league_id = sbl.league_id 
        `;

      connection = await db.getConnection();

      const matchList = await connection.query(query);

      return matchList[0][0];
    } catch (err) {
      logger.error('getRecentlyMatch Model Error : ', err.stack);
      console.error('Error', err.message);
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },

  // 경기 상세 결과 조회(골 득점 정보)
  getMatchDetailByMatchId: async (matchId) => {
    let connection;

    try {
      const query = `
        SELECT *
        FROM match_details md 
          WHERE md.match_id = ${matchId}
        `;

      connection = await db.getConnection();

      const matchDetail = await connection.query(query);

      return matchDetail[0];
    } catch (err) {
      logger.error('getMatchDetailByMatchId Model Error : ', err.stack);
      console.error('Error', err.message);
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },
};

const db = require('../loader/db');
const logger = require('../util/logger');

module.exports = {
  // 팀 시즌 경기 정보 조회
  getMatchByTeamAndSeasonV2: async ({ teamId, seasonId }) => {
    let connection;

    try {
      const query = `
            SELECT sb.match_id
                , sb.season_id
                , t1.team_id as home_team_id
                , t1.name as home_team_name
                , t1.image_path as home_team_image
                , t2.team_id as away_team_id
                , t2.name as away_team_name
                , t2.image_path as away_team_image
                , sb.match_date
                , sb.home_score
                , sb.away_score
                , sb.round
                , sb.is_finished
                , v.name as venue_name
                , l.image_path as league_image
            FROM(
                SELECT *
                FROM match_v2 m 
                WHERE m.season_id = ${seasonId}
                    AND (m.home_team_id = ${teamId} or m.away_team_id = ${teamId})
            ) sb
            LEFT JOIN teams t1 ON t1.team_id = sb.home_team_id
            LEFT JOIN teams t2 ON t2.team_id = sb.away_team_id
            LEFT JOIN venues v ON v.venue_id = sb.match_place
            LEFT JOIN seasons_v2 s ON s.season_id = sb.season_id
            LEFT JOIN leagues_v2 l ON l.league_id = s.league_id 
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

  // 라인업 조회
  getMatchLineUp: async ({ matchId }) => {
    let connection;

    try {
      const query = `
          SELECT sb.lineup_id
                , sb.match_id
                , sb.player_id
                , sb.team_id
                , sb.player_name
                , sb.jersey_number
                , sb.formation_field
                , sb.formation_position
                , sb.position_id
                , p.category as position_category
                , p.initial as position_initial
          FROM (
              SELECT *
              FROM lineups l
              WHERE l.match_id = ${matchId}
          ) sb
          LEFT JOIN positions_v2 p ON p.position_id = sb.position_id
      `;

      connection = await db.getConnection();

      const lineUp = await connection.query(query);

      return lineUp[0];
    } catch (err) {
      logger.error('getMatchLineUp Model Error : ', err.stack);
      console.error('Error', err.message);
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },

  // 예정 경기 조회
  getUpcomingMatchV2: async ({ teamId }) => {
    let connection;

    try {
      const query = `
          SELECT sb.match_id
                , t1.team_id as home_team_id
                , t1.name as home_team_name
                , t1.short_code as home_team_nickname
                , t1.image_path as home_team_image
                , t2.team_id as away_team_id
                , t2.name as away_team_name
                , t2.short_code as away_team_nickname
                , t2.image_path as away_team_image
                , sb.match_date
                , v.name as venue_name
                , l.image_path as league_image
          FROM (
              SELECT *
              FROM match_v2 m 
              WHERE  (m.home_team_id = ${teamId} OR m.away_team_id = ${teamId})
                AND m.match_date >= NOW()
              ORDER BY match_date ASC
              LIMIT 5
          ) sb
          LEFT JOIN teams t1 ON t1.team_id = sb.home_team_id 
          LEFT JOIN teams t2 ON t2.team_id = sb.away_team_id
          LEFT JOIN venues v ON v.venue_id = sb.match_place
          LEFT JOIN seasons_v2 s ON s.season_id = sb.season_id
          LEFT JOIN leagues_v2 l ON l.league_id = s.league_id 
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
  getRecentlyMatchV2: async ({ teamId, count }) => {
    let connection;

    try {
      const query = `
            SELECT sb.match_id
                 , t1.team_id as home_team_id
                 , t1.name as home_team_name
                 , t1.short_code as home_team_nickname
                 , t1.image_path as home_team_image
                 , t2.team_id as away_team_id
                 , t2.name as away_team_name
                 , t2.short_code as away_team_nickname
                 , t2.image_path as away_team_image
                 , sb.match_date
                 , sb.home_score
                 , sb.away_score
                 , sb.round
                 , sb.is_finished
                 , v.name as venue_name
                 , l.image_path as league_image
            FROM (
                SELECT *
                FROM match_v2 m 
                WHERE ( m.home_team_id = ${teamId} OR m.away_team_id = ${teamId} )
                  AND m.is_finished = 1
                ORDER BY match_date DESC
                LIMIT ${count}
            ) sb
            LEFT JOIN teams t1 ON t1.team_id = sb.home_team_id 
            LEFT JOIN teams t2 ON t2.team_id = sb.away_team_id
            LEFT JOIN venues v ON v.venue_id = sb.match_place
            LEFT JOIN seasons_v2 s ON s.season_id = sb.season_id
            LEFT JOIN leagues_v2 l ON l.league_id = s.league_id 
        `;

      connection = await db.getConnection();

      const matchList = await connection.query(query);

      return matchList[0];
    } catch (err) {
      logger.error('getRecentlyMatch Model Error : ', err.stack);
      console.error('Error', err.message);
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },

  // 경기 조회
  getMatch: async ({ matchId }) => {
    let connection;

    try {
      const query = `
            SELECT sb.match_id
                 , sb.season_id
                 , t1.team_id as home_team_id
                 , t1.name as home_team_name
                 , t1.short_code as home_team_nickname
                 , t1.image_path as home_team_image
                 , t2.team_id as away_team_id
                 , t2.name as away_team_name
                 , t2.short_code as away_team_nickname
                 , t2.image_path as away_team_image
                 , sb.match_date
                 , sb.home_score
                 , sb.away_score
                 , sb.round
                 , sb.is_finished
                 , v.name as venue_name
                 , l.image_path as league_image
            FROM (
                SELECT *
                FROM match_v2 m 
                WHERE match_id = ${matchId}
            ) sb
            LEFT JOIN teams t1 ON t1.team_id = sb.home_team_id 
            LEFT JOIN teams t2 ON t2.team_id = sb.away_team_id
            LEFT JOIN venues v ON v.venue_id = sb.match_place
            LEFT JOIN seasons_v2 s ON s.season_id = sb.season_id
            LEFT JOIN leagues_v2 l ON l.league_id = s.league_id 
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

  // 경기 상세 결과 조회(골 득점 및 경고 등)
  getMatchDetailByMatchId: async ({ matchId }) => {
    let connection;

    try {
      const query = `
        SELECT sb.*
              , p1.name as player_name
              , p2.name as related_player_name
        FROM (
            SELECT *
            FROM match_details md
            WHERE md.match_id = ${matchId}
        )sb
        LEFT JOIN players p1 ON p1.player_id = sb.player_id
        LEFT JOIN players p2 ON p2.player_id = sb.related_player_id
        ORDER BY match_detail_id ASC
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

  // 전적 조회
  getTeamPerformance: async ({ teamId, opponentId }) => {
    let connection;

    try {
      const query = `
              SELECT sb.*, count(result) as count
              FROM (
                SELECT CASE
                    WHEN m.home_team_id = ${teamId} THEN
                      CASE
                        WHEN  m.match_result = 'HOME' THEN 'WIN'
                        WHEN  m.match_result = 'AWAY' THEN 'LOSE'
                        ELSE 'DRAW'
                      END
                    WHEN m.away_team_id = ${teamId} THEN
                      CASE
                        WHEN  m.match_result = 'HOME' THEN 'LOSE'
                        WHEN  m.match_result = 'AWAY' THEN 'WIN'
                        ELSE 'DRAW'
                      END
                  END AS result	
                FROM match_v2 m 
                WHERE ( m.home_team_id = ${teamId} OR m.home_team_id = ${opponentId} )
                  AND ( m.away_team_id = ${teamId} OR m.away_team_id = ${opponentId} )
                  AND m.is_finished = 1
              )sb
              GROUP BY sb.result              
          `;

      connection = await db.getConnection();

      const performance = await connection.query(query);

      return performance[0];
    } catch (err) {
      logger.error('getTeamPerformance Model Error : ', err.stack);
      console.error('Error', err.message);
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },

  // 주목할만한 선수ID 조회
  // [ 조건 ]
  // 1. 상대팀과의 경기 기록 기준 골득점이 가장 많은 경우
  // 2. 주목할만한 선수가 해당 경기 시즌에 속해있어야함
  getNotablePlayer: async ({ seasonId, teamId, opponentId }) => {
    let connection;

    try {
      const query = `
                SELECT sb.player_id
                      , sb.name as player_name
                      , sb.height
                      , sb.weight
                      , sb.image_path as player_image
                      , po1.name AS position
                      , po1.initial AS position_initial
                      , sb.goal_count
                FROM (
                  SELECT p.* 
                        , IFNULL( p.detailed_position_id, p.position_id ) as join_position_id
                        , a.goal_count
                  FROM (
                        SELECT md.match_detail_id
                              , md.team_id
                              , md.player_id
                              , COUNT(player_id) as goal_count
                        FROM (
                            SELECT *
                            FROM match_v2 m
                            WHERE 1=1
                                AND ( m.home_team_id = ${teamId} or m.home_team_id = ${opponentId} )
                                AND ( m.away_team_id = ${teamId} or m.away_team_id = ${opponentId} )
                                AND m.is_finished = 1
                        )sb
                        INNER JOIN match_details md on md.match_id = sb.match_id
                        AND md.team_id = ${teamId}
                        AND md.type = "GOAL"
                        GROUP BY md.player_id, md.match_detail_id
                        ORDER BY goal_count , md.match_detail_id DESC                      
                  ) a
                  INNER JOIN players p ON p.player_id = a.player_id
                  INNER JOIN squads s ON s.season_id = ${seasonId}
                  LIMIT 1
                ) sb
                LEFT JOIN positions_v2 po1 ON po1.position_id = sb.join_position_id
        `;

      connection = await db.getConnection();

      const player = await connection.query(query);

      return player[0][0];
    } catch (err) {
      logger.error('getTeamPerformance Model Error : ', err.stack);
      console.error('Error', err.message);
    } finally {
      if (connection) {
        await db.releaseConnection(connection);
      }
    }
  },
};

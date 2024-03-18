const logger = require('../util/logger');

module.exports =
  {
    // 클럽 성적 업데이트 쿼리 생성.
    updateClubPerformanceQuery: async (clubList,premierLeagueList) => {
      try {
        let query = 'INSERT INTO gooner.league_participating_clubs_by_season (participating_club_id,ranking,total_matches, win, draw, lose, scores, conceded, gain_loss_difference, points, recent_5_matches_result) VALUES ';

        for (const [index, premierLeagueData] of premierLeagueList.entries()) {
          for (const clubData of clubList) {
            if (clubData.club_name.includes(premierLeagueData.team)) {
              query += `(${clubData.participating_club_id}, ${premierLeagueData.ranking}, ${premierLeagueData.totalMatches}, ${premierLeagueData.win}, ${premierLeagueData.draw}, ${premierLeagueData.lose}, ${premierLeagueData.score}, ${premierLeagueData.conceded}, ${premierLeagueData.gainLossDifference}, ${premierLeagueData.point}, "${premierLeagueData.last5Matches}")`;
              if (index + 1 !== premierLeagueList.length) {
                console.log(index , premierLeagueList.length);
                query += ',';
              }
            }
          }
        }
        query += `
        ON DUPLICATE KEY UPDATE
          ranking = VALUES(ranking),
          total_matches = VALUES(total_matches),
          win = VALUES(win),
          draw = VALUES(draw),
          lose = VALUES(lose),
          scores = VALUES(scores),
          conceded = VALUES(conceded),
          gain_loss_difference = VALUES(gain_loss_difference),
          points = VALUES(points),
          recent_5_matches_result = VALUES(recent_5_matches_result);
      `;

        return query;
      } catch (err) {
        logger.error('updateClubPerformanceQuery : ', err);
      }

    },
  };
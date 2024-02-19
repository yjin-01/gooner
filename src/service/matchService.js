const matchModel = require('../model/match');
const logger = require('../util/logger');

module.exports = {
  // 팀 정보 조회
  getMatchByTeamAndSeason: async (teamId, season) => {
    try {
      const seasonStartDate = season.split('-')[0] + '-07-01';
      const seasonEndDate = season.split('-')[1] + '-06-30';

      const matchList = await matchModel.getMatchByTeamAndSeason(
        teamId,
        seasonStartDate,
        seasonEndDate,
      );
      return matchList;
    } catch (err) {
      console.error(err);
      logger.error('getMatchByTeamAndSeason Service Error : ', err.stack);
      return null;
    }
  },

  // 상대 전적 조회
  checkRelationalPerformance: async () => {},

  // 라인업 - 1시간전

  getTeamLineUp: async () => {},

  // 예정 경기 조회
  getUpcomingMatch: async (teamId) => {
    try {
      const matchList = await matchModel.getUpcomingMatch(teamId);
      return matchList;
    } catch (err) {
      console.error(err);
      logger.error('getUpcomingMatch Service Error : ', err.stack);
      return null;
    }
  },

  // 최근 경기 결과 조회
  getRecentlyMatch: async (teamId) => {
    try {
      const match = await matchModel.getRecentlyMatch(teamId);

      if (!match) {
        return {};
      }

      const matchId = match.match_id;

      // 경기 상세 조회
      const matchDetail = await matchModel.getMatchDetailByMatchId(matchId);

      return { match, matchDetail };
    } catch (err) {
      console.error(err);
      logger.error('getRecentlyMatch Service Error : ', err.stack);
      return null;
    }
  },
};

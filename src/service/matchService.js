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
  checkRelationalPerformance : async ()
};

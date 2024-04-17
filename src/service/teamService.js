const matchModel = require('../model/match');
const teamModel = require('../model/team');
const logger = require('../util/logger');
const crawler = require('../crawler');

module.exports = {
  // 팀 정보 조회
  getOneTeam: async ({ teamId }) => {
    try {
      const team = await teamModel.getOneTeamV2({ teamId });

      if (!team) {
        return { resultData: {}, code: 'err01' };
      }

      const recentlyMatchs = await matchModel.getRecentlyMatchV2({
        teamId,
        count: 5,
      });

      const resultData = { team, recentlyMatchs };

      return { resultData, code: 'suc01' };
    } catch (err) {
      logger.error('getOneTeam Service Error : ', err.stack);
      throw err;
    }
  },
  // 클럽 별 총 전적 업데이트
  updateClubPerformance: async () => {
    try {
      const clubList = await teamModel.getClubInfo();
      const premierLeagueList = await crawler.totalMatchesBySeason();
      const result = await teamModel.updateClubPerformance(
        clubList,
        premierLeagueList,
      );
      return result;
    } catch (err) {
      console.error(err);
      logger.error('getClubInfo Service Error : ', err.stack);
      return null;
    }
  },
  // 클럽 별 총 전적 업데이트
  updateClubPerformance: async () => {
    try {
      const clubList = await teamModel.getClubInfo();
      const premierLeagueList = await crawler.totalMatchesBySeason();
      const result = await teamModel.updateClubPerformance(
        clubList,
        premierLeagueList,
      );
      return result;
    } catch (err) {
      console.error(err);
      logger.error('getClubInfo Service Error : ', err.stack);
      return null;
    }
  },
};

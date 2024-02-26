const matchModel = require('../model/match');
const teamModel = require('../model/team');
const logger = require('../util/logger');

module.exports = {
  // 팀 정보 조회
  getOneTeam: async (teamId) => {
    try {
      const team = await teamModel.getOneTeam(teamId);

      const recentlyMatchs = await matchModel.getRecentlyMatch(teamId, 5);

      console.log(recentlyMatchs);
      return { team, recentlyMatchs };
    } catch (err) {
      console.error(err);
      logger.error('getOneTeam Service Error : ', err.stack);
      return null;
    }
  },
};

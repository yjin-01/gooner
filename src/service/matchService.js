const matchModel = require('../model/match');

module.exports = {
  // 팀 정보 조회
  getMatchByTeamAndMonth: async (teamId, startDate, endDate) => {
    try {
      const matchList = await matchModel.getMatchByTeamAndMonth(
        teamId,
        startDate,
        endDate,
      );
      return matchList;
    } catch (err) {
      console.error(err);
      logger.error('getOneteam Service Error : ', err.stack);
      return null;
    }
  },
};

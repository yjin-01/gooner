const teamModel = require('../model/team');

module.exports = {
  // 팀 정보 조회
  getOneTeam: async (teamId) => {
    try {
      const team = await teamModel.getOneTeam(teamId);
      return team;
    } catch (err) {
      console.error(err);
      logger.error('getOneTeam Service Error : ', err.stack);
      return null;
    }
  },
};

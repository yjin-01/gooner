const resHandler = require('../util/resHandler');
const teamService = require('../service/teamService');

module.exports = {
  // 팀 정보 조회
  getOneTeam: async (req, res) => {
    try {
      const { teamId } = req.query;
      const result = await teamService.getOneTeam(teamId);
      resHandler.SuccessResponse(res, result, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },
};

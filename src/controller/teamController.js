const resHandler = require('../util/resHandler');
const teamService = require('../service/teamService');

module.exports = {
  // 팀 정보 조회
  getOneTeam: async (req, res) => {
    try {
      const { teamId } = req.query;

      const { resultData, code } = await teamService.getOneTeam({ teamId });

      resHandler.SuccessResponse(res, resultData, 200, code);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  // 스케줄러 테스트 용도
  updateClubPerformance: async (req, res) => {
    try {
      const result = await teamService.updateClubPerformance();
      resHandler.SuccessResponse(res, result, 2001);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },
};

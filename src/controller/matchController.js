const resHandler = require('../util/resHandler');
const matchService = require('../service/matchService');

module.exports = {
  // 팀 정보 조회
  getMatchByTeamAndMonth: async (req, res) => {
    try {
      const { teamId, startDate, endDate } = req.query;
      const matchList = await matchService.getMatchByTeamAndMonth(
        teamId,
        startDate,
        endDate,
      );
      resHandler.SuccessResponse(res, matchList, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },
};

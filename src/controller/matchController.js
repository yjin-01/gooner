const resHandler = require('../util/resHandler');
const matchService = require('../service/matchService');

module.exports = {
  // 팀 정보 조회
  getMatchByTeamAndSeason: async (req, res) => {
    try {
      const { teamId, season } = req.query;
      const matchList = await matchService.getMatchByTeamAndSeason(
        teamId,
        season,
      );
      resHandler.SuccessResponse(res, matchList, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },
};

const seasonService = require('../service/seasonService');
const resHandler = require('../util/resHandler');

module.exports = {
  // 시즌 리스트 조회
  getAllSeason: async (req, res) => {
    try {
      const { teamId } = req.query;
      const team = await seasonService.getAllSeason(teamId);
      resHandler.SuccessResponse(res, team, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  // 리그시즌 리스트 조회
  getLeagueSeasonByTeamId: async (req, res) => {
    try {
      const { teamId } = req.query;
      const { resultData, code } = await seasonService.getLeagueSeasonByTeamId({
        teamId,
      });
      resHandler.SuccessResponse(res, resultData, 200, code);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },
};

const seasonService = require('../service/seasonService');
const resHandler = require('../util/resHandler');

module.exports = {
  // 팀이 참가한 시즌 리스트 조회
  getAllSeason: async (req, res) => {
    try {
      const { teamId } = req.query;

      const { resultData, code } = await seasonService.getAllSeason({ teamId });

      resHandler.SuccessResponse(res, resultData, 200, code);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  // 팀이 참가중인 리그 시즌 조회
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

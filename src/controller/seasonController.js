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

  // 팀이 참가중인 리그 순위 조회
  getSeasonRank: async (req, res) => {
    try {
      const { teamId, seasonId } = req.query;

      const { resultData, code } = await seasonService.getSeasonRank({
        teamId,
        seasonId,
      });

      resHandler.SuccessResponse(res, resultData, 200, code);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },
  // 선수의 팀 시즌 조회
  getLeagueSeasonByPlayerId: async (req, res) => {
    try {
      const { teamId, playerId } = req.query;

      const { resultData, code } =
        await seasonService.getLeagueSeasonByPlayerId({
          teamId,
          playerId,
        });

      resHandler.SuccessResponse(res, resultData, 200, code);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },
};

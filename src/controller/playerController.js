const playerService = require('../service/playerService');
const seasonService = require('../service/seasonService');
const resHandler = require('../util/resHandler');

module.exports = {
  getAllPlayer: async (req, res) => {
    try {
      const players = await playerService.getAllPlayer();
      resHandler.SuccessResponse(res, players, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  // 선수 상세 조회
  getOnePlayer: async (req, res) => {
    try {
      const { playerId } = req.query;

      const { resultData, code } = await playerService.getOnePlayer({
        playerId,
      });

      if (!resultData)
        return resHandler.FailedResponse(res, 'Player were not found', 400);

      resHandler.SuccessResponse(res, resultData, 200, code);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  // 현재 계약되어 있는 선수단 조회
  getTeamPlayer: async (req, res) => {
    try {
      const { teamId } = req.query;

      const players = await playerService.getTeamPlayer(teamId);

      resHandler.SuccessResponse(res, players, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  // 시즌별 선수단 조회
  getTeamPlayerByLeagueSeason: async (req, res) => {
    try {
      const { teamId, seasonId, positionId, keyword } = req.query;

      // 시즌 기간에 해당하는 계약된 선수 조회
      const { resultData, code } =
        await playerService.getTeamPlayerByLeagueSeason({
          teamId,
          seasonId,
          positionId,
          keyword,
        });

      resHandler.SuccessResponse(res, resultData, 200, code);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },
};

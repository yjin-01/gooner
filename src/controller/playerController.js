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
      const { teamId, playerId } = req.query;
      const player = await playerService.getOnePlayer(teamId, playerId);

      if (!player)
        return resHandler.FailedResponse(res, 'Player were not found', 400);

      resHandler.SuccessResponse(res, player, 200);
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
      const { teamId, leagueId, leagueSeason } = req.query;

      // 1. 리그별 시즌 정보 조회
      const season = await seasonService.getSeasonByLeague(
        leagueId,
        leagueSeason,
      );

      if (season.length == 0)
        return resHandler.FailedResponse(res, 'season were not found', 400);

      // 2. 시즌 기간에 해당하는 계약된 선수 조회

      const players = await playerService.getTeamPlayerByLeagueSeason(
        teamId,
        season,
      );

      resHandler.SuccessResponse(res, players, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },
};

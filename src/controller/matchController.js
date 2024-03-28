const resHandler = require('../util/resHandler');
const matchService = require('../service/matchService');

module.exports = {
  // 팀 정보 조회
  getMatchByTeamAndSeason: async (req, res) => {
    try {
      const { teamId, seasonId } = req.query;
      const matchList = await matchService.getMatchByTeamAndSeason(
        teamId,
        seasonId,
      );
      resHandler.SuccessResponse(res, matchList, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  // 예정 경기 조회
  getUpcomingMatch: async (req, res) => {
    try {
      const { teamId } = req.query;
      const matchList = await matchService.getUpcomingMatch(teamId);
      resHandler.SuccessResponse(res, matchList, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  // 최근 경기 결과 조회
  getRecentlyMatch: async (req, res) => {
    try {
      const { teamId } = req.query;
      // 경기 결과 조회
      const match = await matchService.getRecentlyMatch(teamId);

      resHandler.SuccessResponse(res, match, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  // 상대 전적 조회
  checkRelationalPerformance: async (req, res) => {
    try {
      const relativeResult = await matchService.checkRelationalPerformance();

      resHandler.SuccessResponse(res, relativeResult, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },
};

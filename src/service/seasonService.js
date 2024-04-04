const seasonModel = require('../model/season');
const logger = require('../util/logger');

module.exports = {
  getSeasonByLeague: async (leagueId, leagueSeason) => {
    try {
      const season = await seasonModel.getSeasonByLeague(
        leagueId,
        leagueSeason,
      );
      return season;
    } catch (err) {
      console.error(err);
      logger.error('getSeasonByLeague Service Error : ', err.stack);
      return null;
    }
  },

  // 팀이 참가한 시즌 리스트 조회
  getAllSeason: async ({ teamId }) => {
    try {
      const season = await seasonModel.getAllSeasonByTeamIdV2({ teamId });

      return { resultData: season, code: 'suc01' };
    } catch (err) {
      console.error(err);
      logger.error('getAllSeason Service Error : ', err.stack);
      throw err;
    }
  },

  // 팀이 참가중인 리그 시즌 조회
  getLeagueSeasonByTeamId: async ({ teamId }) => {
    try {
      const leagueSeasons = await seasonModel.getCurrentLeagueSeasonByTeamId({
        teamId,
      });
      return { resultData: leagueSeasons, code: 'suc01' };
    } catch (err) {
      console.error(err);
      logger.error('getAllSeason Service Error : ', err.stack);
      throw err;
    }
  },
};

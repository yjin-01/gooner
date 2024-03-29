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

  getAllSeason: async (teamId) => {
    try {
      const season = await seasonModel.getAllSeasonByTeamIdV2(teamId);
      return season;
    } catch (err) {
      console.error(err);
      logger.error('getAllSeason Service Error : ', err.stack);
      return null;
    }
  },

  getLeagueSeasonByTeamId: async ({ teamId }) => {
    try {
      const leagueSeasons = await seasonModel.getCurrentLeagueSeasonByTeamId({
        teamId,
      });
      return { resultData: leagueSeasons, code: 'suc02' };
    } catch (err) {
      console.error(err);
      logger.error('getAllSeason Service Error : ', err.stack);
      return null;
    }
  },
};

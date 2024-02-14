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
      const season = await seasonModel.getAllSeasonByTeamId(teamId);
      return season;
    } catch (err) {
      console.error(err);
      logger.error('getAllSeason Service Error : ', err.stack);
      return null;
    }
  },
};

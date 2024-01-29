const playerModel = require('../model/player');
const logger = require('../util/logger');

module.exports = {
  getAllPlayer: async () => {
    try {
      const players = await playerModel.getAllPlayer();
      return players;
    } catch (err) {
      console.error(err);
      logger.error('Error : ', err.stack);
      return null;
    }
  },

  getOnePlayer: async (teamId, playerId) => {
    try {
      const player = await playerModel.getOnePlayer(teamId, playerId);
      return player;
    } catch (err) {
      console.log(err);
      logger.error('getOnePlayer Service Error : ', err.stack);
      return null;
    }
  },

  getTeamPlayer: async (teamId) => {
    try {
      const teamPlayer = await playerModel.getTeamPlayer(teamId);
      return teamPlayer;
    } catch (err) {
      console.log(err);
      logger.error('getTeamPlayer Service Error : ', err.stack);
      return null;
    }
  },

  getTeamPlayerByLeagueSeason: async (teamId, season) => {
    try {
      const leagueStartDate = season.split('-')[0] + '-07-01';
      const leagueEndDate = season.split('-')[1] + '-06-30';

      const teamPlayer = await playerModel.getTeamPlayerByLeagueSeason(
        teamId,
        leagueStartDate,
        leagueEndDate,
      );
      return teamPlayer;
    } catch (err) {
      console.log(err);
      logger.error('getTeamPlayerByLeagueSeason Service Error : ', err.stack);
      return null;
    }
  },
};

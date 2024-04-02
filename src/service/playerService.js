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

  getOnePlayer: async ({ playerId }) => {
    try {
      const player = await playerModel.getOnePlayerV2({ playerId });

      return { resultData: player, code: 'suc01' };
    } catch (err) {
      logger.error('getOnePlayer Service Error : ', err.stack);
      throw err;
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

  getTeamPlayerByLeagueSeason: async ({
    teamId,
    seasonId,
    positionId,
    keyword,
  }) => {
    try {
      const teamPlayer = await playerModel.getTeamPlayerByLeagueSeasonV2({
        teamId,
        seasonId,
        positionId,
        keyword,
      });

      // throw err;

      return { resultData: teamPlayer, code: 'suc01' };
    } catch (err) {
      logger.error('getTeamPlayerByLeagueSeason Service Error : ', err.stack);
      throw err;
    }
  },

  // 주목할 만한 선수
  getNotablePlayer: async () => {},
};

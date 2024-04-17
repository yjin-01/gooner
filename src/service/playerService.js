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

  getOnePlayer: async ({ teamId, playerId }) => {
    try {
      // 선수 정보 조회
      const player = await playerModel.getOnePlayerV2({ playerId });

      // 선수 최신 등번호 조회
      const jerseyNumber = await playerModel.getPlayerJerseyNumber({
        teamId,
        playerId,
      });

      // squads 테이블에 정보가 없는 경우
      if (!jerseyNumber) {
        player.jersey_number = null;
      } else {
        player.jersey_number = jerseyNumber.jersey_number;
      }

      return { resultData: player, code: 'suc01' };
    } catch (err) {
      logger.error('getOnePlayer Service Error : ', err.stack);
      throw err;
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

const playerModel = require('../model/player');
const matchModel = require('../model/match');
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

  getMatchs: async ({ teamId, playerId }) => {
    try {
      // 1. 선수가 참여한 경기 조회
      const matchList = await matchModel.getMatchByPlayer({ playerId, teamId });

      const matchIds = matchList.map((el) => el.match_id);

      if (matchIds.length === 0) {
        return { resultData: [], code: 'suc01' };
      }

      // 2. 경기별 선수 골득점 기록 조회
      const goalByPlayer = await matchModel.getGoalByPlayer({
        playerId,
        teamId,
        matchIds,
      });

      // 3. 경기 정보 조회
      const matchInfoList = await matchModel.getMatch({ matchIds });

      matchInfoList.forEach((match) => {
        goalByPlayer.forEach((goal) => {
          if (match.match_id === goal.match_id) {
            match.player_goal_count = goal.player_goal_count;
          } else {
            match.player_goal_count = 0;
          }
        });
      });

      return { resultData: matchInfoList, code: 'suc01' };
    } catch (err) {
      logger.error('getMatchs Service Error : ', err.stack);
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
};

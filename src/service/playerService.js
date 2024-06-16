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
      const playerMatchList = await matchModel.getMatchByPlayer({
        playerId,
        teamId,
        matchIds: [],
      });

      const playerMatchIds = playerMatchList.map((el) => el.match_id);

      if (playerMatchIds.length === 0) {
        return { resultData: [], code: 'suc01' };
      }

      // 2. 경기별 선수 골득점 기록 조회
      const goalByPlayer = await matchModel.getGoalByPlayer({
        playerId,
        teamId,
        matchIds: playerMatchIds,
      });

      // 3. 경기 정보 조회
      const matchInfoList = await matchModel.getMatch({
        matchIds: playerMatchIds,
      });
      let total_goal_count = 0;

      matchInfoList.forEach((match) => {
        match.player_goal_count = 0;
        goalByPlayer.forEach((goal) => {
          if (match.match_id === goal.match_id) {
            match.player_goal_count = goal.player_goal_count;
            total_goal_count += goal.player_goal_count;
          }
        });
      });

      const total_match_count = playerMatchList.length;

      return {
        resultData: { total_goal_count, total_match_count, matchInfoList },
        code: 'suc01',
      };
    } catch (err) {
      logger.error('getMatchs Service Error : ', err.stack);
      throw err;
    }
  },

  getMatchByseason: async ({ teamId, playerId, seasonId }) => {
    try {
      // 선수의 시즌 경기 조회
      const seasonMatchList = await matchModel.getMatchByTeamAndSeasonV2({
        teamId,
        seasonId,
      });

      const seasonMatchIds = seasonMatchList.map((el) => el.match_id);

      // 1. 선수가 참여한 경기 조회
      const playerMatchList = await matchModel.getMatchByPlayer({
        playerId,
        teamId,
        matchIds: seasonMatchIds,
      });

      const playerMatchIds = playerMatchList.map((el) => el.match_id);

      if (playerMatchIds.length === 0) {
        return { resultData: [], code: 'suc01' };
      }

      // 2. 경기별 선수 골득점 기록 조회
      const goalByPlayer = await matchModel.getGoalByPlayer({
        playerId,
        teamId,
        matchIds: playerMatchIds,
      });

      const total_goal_count = goalByPlayer.reduce((acc, cur) => {
        return acc + cur.player_goal_count;
      }, 0);

      // 3. 경기별 선수 옐로카드 기록 조회
      const yellowCardlByPlayer = await matchModel.getYellowCardlByPlayer({
        playerId,
        teamId,
        matchIds: playerMatchIds,
      });

      const total_yellowcard_count = yellowCardlByPlayer.reduce((acc, cur) => {
        return acc + cur.player_yellowcard_count;
      }, 0);

      // 4. 경기별 선수 레드카드 기록 조회
      const redCardlByPlayer = await matchModel.getRedCardlByPlayer({
        playerId,
        teamId,
        matchIds: playerMatchIds,
      });

      const total_redcard_count = redCardlByPlayer.reduce((acc, cur) => {
        return acc + cur.player_redcard_count;
      }, 0);

      const total_match_count = playerMatchList.length;

      return {
        resultData: {
          total_goal_count,
          total_match_count,
          total_yellowcard_count,
          total_redcard_count,
        },
        code: 'suc01',
      };
    } catch (err) {
      logger.error('getMatchSeason Service Error : ', err.stack);
      throw err;
    }
  },

  getTeamPlayerByLeagueSeason: async ({
    teamId,
    seasonId,
    positionId,
    keyword,
    page,
    size,
  }) => {
    try {
      const { teamPlayer, currentPage, itemsPerPage } =
        await playerModel.getTeamPlayerByLeagueSeasonV2({
          teamId,
          seasonId,
          positionId,
          keyword,
          page,
          size,
        });

      // throw err;

      return {
        resultData: { teamPlayer, page: currentPage, size: itemsPerPage },
        code: 'suc01',
      };
    } catch (err) {
      logger.error('getTeamPlayerByLeagueSeason Service Error : ', err.stack);
      throw err;
    }
  },
};

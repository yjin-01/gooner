const matchModel = require('../model/match');
const logger = require('../util/logger');

module.exports = {
  // 팀 정보 조회
  getMatchByTeamAndSeason: async ({ teamId, seasonId }) => {
    try {
      const matchList = await matchModel.getMatchByTeamAndSeasonV2({
        teamId,
        seasonId,
      });

      if (matchList.length === 0) {
        return { resultData: {}, code: 'err01' };
      }

      return { resultData: matchList, code: 'suc01' };
    } catch (err) {
      logger.error('getMatchByTeamAndSeason Service Error : ', err.stack);
      throw err;
    }
  },

  // 상대 전적 조회
  checkRelationalPerformance: async () => {
    try {
      const opponent = await matchModel.getOneUpcomingOpponent();
      console.log(opponent);
      const relativeMatchList = await matchModel.checkRelativePerformance(
        opponent.opponent,
      );
      console.log(relativeMatchList);
      // 1안
      // const isWin = (match) => (match.home_team_id === 2 && match.match_result === "HOME") || (match.away_team_id === 2 && match.match_result === "AWAY");
      // const isLose = (match) => (match.away_team_id === 2 && match.match_result === "HOME") || (match.home_team_id === 2 && match.match_result === "AWAY");
      // const isDraw = (match) => match.match_result === "DRAW";
      //
      // const updateResult = (relativeMatchList) => relativeMatchList.reduce((result, match) => {
      //   if (isWin(match)) result.win++;
      //   else if (isLose(match)) result.lose++;
      //   else if (isDraw(match)) result.draw++;
      //   return result;
      // }, { win, lose, draw });
      //
      // const relativeResult = updateResult(relativeMatchList);

      // 2안
      const relativeResult = {
        win: 0,
        lose: 0,
        draw: 0,
      };
      for (match of relativeMatchList) {
        if (
          (match.home_team_id === 2 && match.match_result === 'HOME') ||
          (match.away_team_id === 2 && match.match_result === 'AWAY')
        ) {
          relativeResult.win++;
        } else if (
          (match.away_team_id === 2 && match.match_result === 'HOME') ||
          (match.home_team_id === 2 && match.match_result === 'AWAY')
        ) {
          relativeResult.lose++;
        } else if (match.match_result === 'DRAW') {
          relativeResult.draw++;
        }
      }

      return relativeResult;
    } catch (err) {
      console.error(err);
      logger.error('checkRelationalPerformance Service Error : ', err.stack);
      return null;
    }
  },

  // 라인업 - 1시간전

  getTeamLineUp: async () => {},

  // 예정 경기 조회
  getUpcomingMatch: async ({ teamId }) => {
    try {
      const matchList = await matchModel.getUpcomingMatchV2({ teamId });

      if (matchList.length === 0) {
        return { resultData: {}, code: 'err01' };
      }

      return { resultData: matchList, code: 'suc01' };
    } catch (err) {
      logger.error('getUpcomingMatch Service Error : ', err.stack);
      return null;
    }
  },

  // 가장 최근 경기 결과 조회
  getRecentlyMatch: async ({ teamId }) => {
    try {
      const match = await matchModel.getRecentlyMatchV2({ teamId, count: 1 });

      if (match.length === 0) {
        return { resultData: {}, code: 'err01' };
      }

      const matchId = match[0].match_id;

      // 경기 상세 조회
      const matchDetail = await matchModel.getMatchDetailByMatchId({ matchId });

      const resultData = { match: match[0], matchDetail };

      return { resultData, code: 'suc01' };
    } catch (err) {
      logger.error('getRecentlyMatch Service Error : ', err.stack);
      throw err;
    }
  },

  // 경기 조회
  getMatch: async ({ matchId }) => {
    try {
      const match = await matchModel.getMatch({ matchId });

      if (!match) {
        return { resultData: {}, code: 'err01' };
      }

      // 경기 상세 조회
      const matchDetail = await matchModel.getMatchDetailByMatchId({ matchId });

      const resultData = { match: match, matchDetail };

      return { resultData, code: 'suc01' };
    } catch (err) {
      logger.error('getRecentlyMatch Service Error : ', err.stack);
      throw err;
    }
  },
};

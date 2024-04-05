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

  // TODO (승,무,패 데이터 추가 후 수정 필요)
  // 팀이 참가중인 리그 시즌 조회
  // 조건
  // 1. 선택한 팀을 포함하여 4개의 팀이 나와야함
  // 2. 기본 조건 본인 팀 순위 기준 상위 1팀, 하위 2팀
  // 3. 팀이 1위인 경우 하위3팀 포함
  // 4. 팀이 꼴찌인 경우 상위 팀을 추가로 포함
  getSeasonRank: async ({ teamId, seasonId }) => {
    try {
      const rank = await seasonModel.getSeasonRank({
        seasonId,
      });

      let teamIndex = -1;

      // 팀의 순위 인덱스 찾기
      for (let i = 0; i < rank.length; i++) {
        if (rank[i].team_id === Number(teamId)) {
          teamIndex = i;
        }
      }

      if (teamIndex === -1) {
        return { resultData: {}, code: 'err01' };
      }

      const frontIndex = teamIndex - 1;
      const backIndex = teamIndex + 3;

      const teamRankList = [];

      for (let j = frontIndex; j < teamIndex; j++) {
        if (rank[j]) {
          teamRankList.push(rank[j]);
        }
      }

      for (let l = teamIndex; l <= backIndex; l++) {
        if (rank[l] && teamRankList.length < 4) {
          teamRankList.push(rank[l]);
        }
      }

      // 조건 4 => 팀의 순위가 하위여서 조건을 못 채운 경우 앞 순위로 채우기
      if (teamRankList.length < 4) {
        for (let k = frontIndex - 1; k > frontIndex - 3; k--) {
          if (rank[k] && teamRankList.length < 4) {
            teamRankList.push(rank[k]);
          }
        }
        teamRankList.sort((a, b) => a['position'] - b['position']);
      }

      return { resultData: teamRankList, code: 'suc01' };
    } catch (err) {
      console.error(err);
      logger.error('getAllSeason Service Error : ', err.stack);
      throw err;
    }
  },
};

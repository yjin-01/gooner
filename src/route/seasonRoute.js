const { Router } = require('express');
const {
  getAllSeason,
  getLeagueSeasonByTeamId,
} = require('../controller/seasonController');

const seasonRouter = Router();

// 시즌 리스트 조회
seasonRouter.get('/list', getAllSeason);

// 리그시즌 리스트 조회
seasonRouter.get('/league', getLeagueSeasonByTeamId);

module.exports = seasonRouter;

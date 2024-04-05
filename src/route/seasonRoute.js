const { Router } = require('express');
const {
  getAllSeason,
  getLeagueSeasonByTeamId,
  getSeasonRank,
} = require('../controller/seasonController');
const { validatorErrorCheck } = require('../middleware/validator');
const { query } = require('express-validator');

const seasonRouter = Router();

// 시즌 리스트 조회
seasonRouter.get(
  '/list',
  [query('teamId', 'Bad Request').notEmpty().isNumeric(), validatorErrorCheck],
  getAllSeason,
);

// 리그시즌 리스트 조회
seasonRouter.get(
  '/league',
  [query('teamId', 'Bad Request').notEmpty().isNumeric(), validatorErrorCheck],
  getLeagueSeasonByTeamId,
);

// 리그시즌 순위 조회
seasonRouter.get(
  '/rank',
  [
    query('teamId', 'Bad Request').notEmpty().isNumeric(),
    query('seasonId', 'Bad Request').notEmpty().isNumeric(),
    validatorErrorCheck,
  ],
  getSeasonRank,
);

module.exports = seasonRouter;

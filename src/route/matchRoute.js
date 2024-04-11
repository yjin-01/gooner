const { Router } = require('express');
const {
  getMatchByTeamAndSeason,
  getUpcomingMatch,
  getRecentlyMatch,
  checkRelationalPerformance,
  getMatch,
  getMatchInformation,
} = require('../controller/matchController');
const { validatorErrorCheck } = require('../middleware/validator');
const { query, param } = require('express-validator');

const matchRouter = Router();

// 경기 조회
matchRouter.get(
  '/information',
  [
    query('matchId', 'Bad Request').notEmpty().isNumeric(),
    query('seasonId', 'Bad Request').notEmpty().isNumeric(),
    query('teamId', 'Bad Request').notEmpty().isNumeric(),
    query('opponentId', 'Bad Request').notEmpty().isNumeric(),
    validatorErrorCheck,
  ],
  getMatchInformation,
);

// 월별 경기 조회
matchRouter.get(
  '/team',
  [
    query('teamId', 'Bad Request').notEmpty().isNumeric(),
    query('seasonId', 'Bad Request').notEmpty().isNumeric(),
    validatorErrorCheck,
  ],
  getMatchByTeamAndSeason,
);

// Upcoming Matches 조회
matchRouter.get(
  '/team/upcoming',
  [query('teamId', 'Bad Request').notEmpty().isNumeric(), validatorErrorCheck],
  getUpcomingMatch,
);

// Recently Matches 조회
matchRouter.get(
  '/team/recently',
  [query('teamId', 'Bad Request').notEmpty().isNumeric(), validatorErrorCheck],
  getRecentlyMatch,
);

// 경기 조회
matchRouter.get(
  '/:matchId',
  [param('matchId', 'Bad Request').notEmpty().isNumeric(), validatorErrorCheck],
  getMatch,
);

// 상대 전적 조회
matchRouter.get('/relatvie-performance', checkRelationalPerformance);

module.exports = matchRouter;

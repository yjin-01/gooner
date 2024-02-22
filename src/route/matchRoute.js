const { Router } = require('express');
const {
  getMatchByTeamAndSeason,
  getUpcomingMatch,
  getRecentlyMatch,
  checkRelationalPerformance
} = require('../controller/matchController');

const matchRouter = Router();

// 월별 경기 조회
matchRouter.get('/team', getMatchByTeamAndSeason);

// Upcoming Matches 조회
matchRouter.get('/team/upcoming', getUpcomingMatch);

// Recently Matches 조회
matchRouter.get('/team/recently', getRecentlyMatch);

// 상대 전적 조회
matchRouter.get('/relatvie-performance',checkRelationalPerformance);

module.exports = matchRouter;

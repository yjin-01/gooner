const { Router } = require('express');
const {
  getMatchByTeamAndSeason,
  getUpcomingMatch,
  getRecentlyMatch,
} = require('../controller/matchController');

const matchRouter = Router();

// 월별 경기 조회
matchRouter.get('/team', getMatchByTeamAndSeason);

// Upcoming Matches 조회
matchRouter.get('/team/upcoming', getUpcomingMatch);

// Upcoming Matches 조회
matchRouter.get('/team/recently', getRecentlyMatch);

module.exports = matchRouter;

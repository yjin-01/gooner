const { Router } = require('express');
const { getMatchByTeamAndSeason } = require('../controller/matchController');

const matchRouter = Router();

// 월별 경기 조회
matchRouter.get('/team', getMatchByTeamAndSeason);

module.exports = matchRouter;

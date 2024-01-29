const { Router } = require('express');
const { getMatchByTeamAndMonth } = require('../controller/matchController');

const matchRouter = Router();

// 월별 경기 조회
matchRouter.get('/team', getMatchByTeamAndMonth);

module.exports = matchRouter;

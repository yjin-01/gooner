const { Router } = require('express');
const { getAllSeason } = require('../controller/seasonController');

const seasonRouter = Router();

// 시즌 리스트 조회
seasonRouter.get('/list', getAllSeason);

module.exports = seasonRouter;

const { Router } = require('express');

const playerController = require('../controller/playerController');

const playerRouter = Router();

playerRouter.get('/all', playerController.getAllPlayer);

// 선수 상세 조회
playerRouter.get('/detail', playerController.getOnePlayer);

// 팀의 현재 선수단 조회
playerRouter.get('/team', playerController.getTeamPlayer);

// 시즌별 팀의 선수단 조회
playerRouter.get('/team/season', playerController.getTeamPlayerByLeagueSeason);

// playerRouter.get("/team",playerController.getMyTeamPlayer);

module.exports = playerRouter;

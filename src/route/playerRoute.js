const { Router } = require('express');
const { check, query } = require('express-validator');
const playerController = require('../controller/playerController');
const { validatorErrorCheck } = require('../middleware/validator');

const playerRouter = Router();

playerRouter.get('/all', playerController.getAllPlayer);

// 선수 상세 조회
playerRouter.get(
  '/detail',
  [
    query('playerId', 'Bad Request').notEmpty().isNumeric(),
    query('teamId', 'Bad Request').notEmpty().isNumeric(),
    validatorErrorCheck,
  ],
  playerController.getOnePlayer,
);

// 시즌별 팀의 선수단 조회
playerRouter.get(
  '/team/season',
  [
    query('teamId', 'Bad Request').notEmpty().isNumeric(),
    query('seasonId', 'Bad Request').if(query('seasonId').exists()).isNumeric(),
    query('positionId', 'Bad Request')
      .if(query('positionId').exists())
      .isNumeric(),
    query('keyword', 'Bad Request').if(query('keyword').exists()).isString(),
    validatorErrorCheck,
  ],
  playerController.getTeamPlayerByLeagueSeason,
);

// playerRouter.get("/team",playerController.getMyTeamPlayer);

module.exports = playerRouter;

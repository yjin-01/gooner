const { Router } = require('express');

const playerController = require('../controller/playerController');

const playerRouter = Router();

playerRouter.get('/all', playerController.getAllPlayer);
playerRouter.get('')


module.exports = playerRouter;

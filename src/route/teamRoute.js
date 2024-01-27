const { Router } = require('express');
const { getOneTeam } = require('../controller/teamController');

const teamRouter = Router();

teamRouter.get('/detail', getOneTeam);

module.exports = teamRouter;

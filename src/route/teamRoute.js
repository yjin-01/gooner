const { Router } = require('express');
const { getOneTeam, updateClubPerformance } = require('../controller/teamController');

const teamRouter = Router();

teamRouter.get('/detail', getOneTeam);

teamRouter.get('/scheduler-test', updateClubPerformance);


module.exports = teamRouter;

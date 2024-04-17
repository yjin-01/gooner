const { Router } = require('express');
const {
  getOneTeam,
  updateClubPerformance,
} = require('../controller/teamController');
const { query } = require('express-validator');
const { validatorErrorCheck } = require('../middleware/validator');

const teamRouter = Router();

teamRouter.get(
  '/detail',
  [query('teamId', 'Bad Request').notEmpty().isNumeric(), validatorErrorCheck],
  getOneTeam,
);

teamRouter.get('/scheduler-test', updateClubPerformance);

teamRouter.get('/scheduler-test', updateClubPerformance);


module.exports = teamRouter;

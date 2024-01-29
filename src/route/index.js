const { Router } = require('express');
const userRouter = require('./userRoute');
const playerRouter = require('./playerRoute');
const teamRouter = require('./teamRoute');
const matchRouter = require('./matchRoute');

const router = Router();

router.use('/user', userRouter);
router.use('/player', playerRouter);
router.use('/team', teamRouter);
router.use('/match', matchRouter);

module.exports = router;

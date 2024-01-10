const { Router } = require('express');

const userController = require('../controller/userController');

const userRouter = Router();

userRouter.get('/', userController.userFindAll);
userRouter.get('/test', (req, res) => {
  res.send('test');
});

module.exports = userRouter;

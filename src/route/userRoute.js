const { Router } = require('express');

const userController = require('../controller/userController');

const userRouter = Router();

userRouter.post('/email', userController.sendToVerificationEmail);

userRouter.post(
  '/email/verification',
  userController.checkedVerificationNumber,
);

userRouter.get('/', userController.userFindAll);
userRouter.get('/test', (req, res) => {
  res.send('test');
});

userRouter.get('/nickname', userController.checkedNickname);

userRouter.post('/', userController.createUser);

module.exports = userRouter;

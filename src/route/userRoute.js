const { Router } = require('express');
const { check } = require('express-validator');
const userController = require('../controller/userController');
const { validatorErrorCheck } = require('../middleware/validator');

const userRouter = Router();

userRouter.post(
  '/email',
  [
    check('email').notEmpty().isEmail().withMessage('잘못된 이메일입니다.'),
    validatorErrorCheck,
  ],
  userController.sendToVerificationEmail,
);

userRouter.post(
  '/email/verification',
  [
    check('email').notEmpty().isEmail().withMessage('잘못된 이메일입니다.'),
    check('code')
      .notEmpty()
      .isString()
      .withMessage('인증 번호를 입력해주세요.'),
    validatorErrorCheck,
  ],
  userController.checkedVerificationNumber,
);

// 로그인
userRouter.post(
  '/login',
  check('email').notEmpty().isEmail().withMessage('잘못된 이메일입니다.'),
  check('password')
    .notEmpty()
    .isString()
    .withMessage('비밀번호를 입력해주세요.'),
  check('deviceToken')
    .notEmpty()
    .isString()
    .withMessage('디바이스 토큰을 입력해주세요.'),
  userController.login,
);

// 회원가입
userRouter.post(
  '/',
  [
    check('email').notEmpty().isEmail().withMessage('잘못된 이메일입니다.'),
    check('password')
      .notEmpty()
      .isString()
      .withMessage('비밀번호를 입력해주세요.'),
    check('nickname')
      .notEmpty()
      .isString()
      .withMessage('닉네임을 입력해주세요.'),
    check('teamId').notEmpty().isNumeric().withMessage('팀ID를 입력해주세요.'),
    validatorErrorCheck,
  ],
  userController.createUser,
);

userRouter.get('/', userController.userFindAll);
userRouter.get('/test', (req, res) => {
  res.send('test');
});

userRouter.post('/push', userController.pushTest);

userRouter.get('/nickname', userController.checkedNickname);

module.exports = userRouter;

const authService = require('../service/authService');
const userService = require('../service/userService');
const pushSender = require('../util/push');
const resHandler = require('../util/resHandler');

module.exports = {
  userFindAll: async (req, res) => {
    try {
      const user = await userService.findAll();
      resHandler.SuccessResponse(res, user, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  sendToVerificationEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const result = await userService.sendToVerificationEmail({ email });
      resHandler.SuccessResponse(res, result, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  checkedVerificationNumber: async (req, res) => {
    try {
      const { email, code } = req.body;
      const result = await userService.checkedVerificationNumber({
        email,
        code,
      });
      resHandler.SuccessResponse(res, result, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  checkedNickname: async (req, res) => {
    try {
      const { nickname } = req.query;
      const user = await userService.checkedNickname({ nickname });
      resHandler.SuccessResponse(res, user, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  createUser: async (req, res) => {
    try {
      const { email, nickname, password, teamId } = req.body;

      const result = await userService.createUser({
        email,
        nickname,
        password,
        teamId,
      });

      resHandler.SuccessResponse(res, result, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password, deviceToken } = req.body;

      const result = await authService.login({ email, password, deviceToken });

      resHandler.SuccessResponse(res, result, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },

  pushTest: async (req, res) => {
    try {
      // 특정기기에 전송
      const { deviceToken } = req.body;

      // 안드로이드
      let pushOption = {
        notification: {
          title: '테스트 푸쉬 발송',
          body: '보내지나요?',
        },
        data: {
          title: '테스트 푸쉬 발송',
          body: '보내지나요?',
        },
        token: deviceToken,
      };

      const result = await pushSender.sendToPush({ pushOption });

      resHandler.SuccessResponse(res, result, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },
};

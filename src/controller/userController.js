const userService = require('../service/userService');
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
      const { email, number } = req.body;
      const result = await userService.checkedVerificationNumber({
        email,
        number,
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
      const { userId, nickname, password, teamId } = req.body;

      const user = await userService.createUser({
        userId,
        nickname,
        password,
        teamId,
      });

      resHandler.SuccessResponse(res, user, 200);
    } catch (err) {
      console.error(err);
      resHandler.FailedResponse(res, err.stack, 500);
    }
  },
};

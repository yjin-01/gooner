const { verifyPassword } = require('../util/crypto');
const jwt = require('../util/jwt');

const {
  TOKEN_INVALID,
  TOKEN_EXPIRED,
  ACCESSTOKEN_INVALID,
  ACCESSTOKEN_EXPIRED,
} = require('../config/jwt/tokenStatusConfig');
const logger = require('../util/logger');
const userModel = require('../model/user');

module.exports = {
  login: async ({ email, password, deviceToken }) => {
    try {
      const user = await userModel.getUserByEmail({ email });

      if (!user) {
        return '로그인에 실패하였습니다.';
      }

      // 비밀번호 비교
      const verified = await verifyPassword(password, user.salt, user.password);

      if (!verified) {
        return '로그인에 실패하였습니다.';
      }

      // 디바이스 토큰 저장
      await userModel.saveDeviceToken({ userId: user.user_id, deviceToken });

      const accessToken = jwt.createAccessToken(user.email);

      return {
        email: user.email,
        nickname: user.nickname,
        teamId: user.club_id,
        accessToken,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Login failed');
    }
  },

  verifyToken: async (reqData) => {
    try {
      const accessToken = reqData.headers.authorization.split('Bearer ')[1];

      if (!accessToken) return { accessToken: null, result: false };

      const accTokenInfo = jwt.verify(accessToken); // => invalid, expired, {payload}

      // accessToken이 invalid된 경우 (accessToken 이 변조된 경우)
      if (accTokenInfo === TOKEN_INVALID)
        return { accessToken: null, result: ACCESSTOKEN_INVALID };
      // accessToken이 expired된 경우 (accessToken이 만료된 경우)
      else if (accTokenInfo === TOKEN_EXPIRED) {
      } else {
        return { accessToken: accessToken, result: ACCESSTOKEN_EXPIRED };
      }
    } catch (err) {
      console.error(err);
      logger.error('Token Error : ', err.stack);
      return { accessToken: null, result: false };
    }
  },
};

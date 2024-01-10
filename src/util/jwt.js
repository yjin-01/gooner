const randToken = require("rand-token");
const jwt = require("jsonwebtoken");
const { options, secretKey } = require("../config/jwt/jwtConfig");
const {
  TOKEN_EXPIRED,
  TOKEN_INVALID,
} = require("../config/jwt/tokenStatusConfig");
const logger = require("./logger");

module.exports = {
  // 토큰 생성
  createAccessToken: (uuid) => {
    const payload = {
      uuid: uuid,
    };
    const result = jwt.sign(payload, secretKey, options);
    return result;
  },

  createRefreshToken: () => {
    const payload = {};
    const result = jwt.sign(payload, secretKey, options);
    return result;
  },

  verify: (token) => {
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (err) {
      logger.error("Token Verify Error : ", err.stack);
      if (err.message === "jwt expired") {
        logger.error("AccessToken is expired");
        return TOKEN_EXPIRED;
      } else if (err.message === "invalid token") {
        logger.error("AccessToken is invalid");
        return TOKEN_INVALID;
      } else {
        logger.error("AccessToken is invalid");
        return TOKEN_INVALID;
      }
    }
  },
  /**
   *
   * @param {string} token refreshToken
   * @param {string} uuid admin_uuid
   * @returns false || true || TOKEN_EXPIRED || TOKEN_INVALID
   */
  refreshVerify: async (token, uuid) => {
    try {
      const existing_refreshToken = await redis.get(uuid);

      if (existing_refreshToken === token) {
        try {
          jwt.verify(token, secretKey);
          return true;
        } catch (err) {
          logger.error("RefreshToken Verify Error : ", err.stack);
          if (err.message === "jwt must be provided") {
            logger.error("RefreshToken is expired");
            return TOKEN_EXPIRED;
          } else if (err.message === "invalid token") {
            logger.error("RefreshToken is invalid");
            return TOKEN_INVALID;
          } else {
            logger.error("RefreshToken is invalid");
            return TOKEN_INVALID;
          }
        }
      }
    } catch (err) {
      console.error("RefreshToken Redis Error ", err);
      logger.error("RefreshToken Redis Error : ", err.stack);
      // redis가 터질경우 고려해야함.
      return null;
    }
  },
};

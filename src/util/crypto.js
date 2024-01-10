const crypto = require("crypto");
const util = require("util");
const logger = require("./logger");
const dotenv = require("dotenv").config();

const pdkdf2Promise = util.promisify(crypto.pbkdf2);
const randomBytesPromise = util.promisify(crypto.randomBytes);

module.exports = {
  // Salt 생성
  createSalt: async () => {
    const salt = await randomBytesPromise(64);
    return salt.toString("base64");
  },

  // 비밀번호 (암호화) -> 단방향 암호화
  createHashedPassword: async (userPwd, userSalt) => {
    try {
      const salt = userSalt;
      const key = await pdkdf2Promise(
        userPwd,
        salt,
        Number(process.env.KEY_STRETCHING),
        64,
        "sha512"
      );

      const hashedPassword = key.toString("base64");

      return hashedPassword;
    } catch (err) {
      logger.error("createHashedPassword Error : ", err.stack);
      return null;
    }
  },

  // 기존의 비밀번호와 입력한 비밀번호가 같은지의 여부 판단
  verifyPassword: async (originPwd, userSalt, userPwd) => {
    try {
      const key = await pdkdf2Promise(
        originPwd,
        userSalt,
        Number(process.env.KEY_STRETCHING),
        64,
        "sha512"
      );
      const hashedPassword = key.toString("base64");

      if (hashedPassword !== userPwd) return false;
      return true;
    } catch (err) {
      logger.error("verifyPassword Error : ", err.stack);
      return false;
    }
  },
};

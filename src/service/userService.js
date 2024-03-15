const uuid = require('../util/uuid');
const userModel = require('../model/user');
const logger = require('../util/logger');
const mailSender = require('../util/email');
const moment = require('moment');
const { createSalt, createHashedPassword } = require('../util/crypto');

module.exports = {
  findAll: async () => {
    try {
      const users = await userModel.getAllUser();
      return users;
    } catch (err) {
      console.error(err);
      logger.error('Error : ', err.stack);
    }
  },

  sendToVerificationEmail: async ({ email }) => {
    try {
      // 이메일 중복 확인
      const user = await userModel.getUserByEmail({ email });

      if (user) {
        return { resultData: '이미 가입된 이메일입니다.', code: '01' };
      }

      // 인증번호 발급
      const code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

      // 이메일 전송
      const verifyMailOptions = {
        to: email,
        subject: 'Gooner 인증번호 메일',
        text: `인증번호: ${code}`,
      };

      const sendResult = await mailSender.sendToEmail({
        emailOption: verifyMailOptions,
      });

      if (!sendResult) {
        // 인증메일 전송 실패
        throw new InternalServerError('메일 전송 실패');
      }

      // 인증번호 DB 저장
      // 이미 저장된 이메일의 인증번호가 있는 경우 삭제 후 저장
      const checkedVerfication = await userModel.getEmailVerificationByEmail({
        email,
      });

      if (checkedVerfication) {
        // 삭제
        await userModel.deleteVerificationNumber({ email });
      }

      const issueTime = moment().format('YYYY-MM-DD hh:mm:ss');

      // 이메일, 인증번호 저장
      await userModel.saveVerificationNumber({
        email,
        code,
        issueTime,
      });

      return { resultData: '인증 메일이 전송되었습니다.', code: '02' };
    } catch (err) {
      console.error(err);
      logger.error('sendToEmail Service : ', err.stack);
      throw err;
    }
  },

  checkedVerificationNumber: async ({ email, verificationCode }) => {
    try {
      const checkedVerfication = await userModel.getEmailVerificationByEmail({
        email,
      });

      if (checkedVerfication.verification_code !== verificationCode) {
        return { resultData: '인증에 실패하였습니다', code: '01' };
      } else if (checkedVerfication.is_verified === 1) {
        return { resultData: '이미 인증된 이메일입니다.', code: '02' };
      }

      await userModel.updateVerificationStatus({ email });

      return { resultData: '인증 성공하였습니다.', code: '03' };
    } catch (err) {
      console.error(err);
      logger.error('checkedVerticationNumber Service : ', err.stack);
      throw err;
    }
  },

  checkedNickname: async ({ nickname }) => {
    try {
      const user = await userModel.getUserByNickname({ nickname });

      if (user) {
        return '이미 존재하는 닉네임입니다.';
      }

      return '사용 가능한 닉네임입니다.';
    } catch (err) {
      console.error(err);
      logger.error('checkedNickname Service : ', err.stack);
      throw err;
    }
  },

  createUser: async ({ email, nickname, password, teamId }) => {
    try {
      // 이메일 & 닉네임 중복 확인
      const userEamil = await userModel.getUserByEmail({ email });

      if (userEamil) {
        return { resultData: '이미 가입된 이메일입니다.', code: '01' };
      }

      const userNickname = await userModel.getUserByNickname({ nickname });

      if (userNickname) {
        return { resultData: '이미 존재하는 닉네임입니다.', code: '02' };
      }

      const checkedEmail = await userModel.getEmailVerificationByEmail({
        email,
      });

      if (checkedEmail.is_verified === 0) {
        return { resultData: '인증되지 않은 이메일입니다.', code: '03' };
      }

      const currentTime = moment().format('YYYY-MM-DD hh:mm:ss');

      const diffTime = moment(currentTime).diff(
        checkedEmail.created_at,
        'minutes',
      );

      if (diffTime > 60) {
        return { resultData: '인증 유효 시간이 만료되었습니다.', code: '04' };
      }

      const userSalt = await createSalt();
      const hashedPassword = await createHashedPassword(password, userSalt);

      const result = await userModel.createUser({
        email,
        nickname,
        hashedPassword,
        userSalt,
        teamId,
      });

      if (result.affectedRows !== 1) {
        throw new Error('회원가입에 실패하였습니다.');
      }

      return { resultData: '회원가입에 성공하였습니다.', code: '05' };
    } catch (err) {
      console.error(err);
      logger.error('createUser Service Error : ', err.stack);
      throw err;
    }
  },
};

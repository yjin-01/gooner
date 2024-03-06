const nodemailer = require('nodemailer');
const logger = require('./logger');

const mailSender = {
  sendToEmail: async function ({ emailOption }) {
    try {
      const transporter = nodemailer.createTransport({
        // 사용하고자 하는 이메일 서비스 => gmail계정으로 전송('gmail')
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailOption.to,
        subject: emailOption.subject,
        text: emailOption.text,
      };

      // 이메일 전송
      const result = await transporter.sendMail({ ...mailOptions });

      console.log('Email send Success : ', result.response);

      return true;
    } catch (err) {
      console.error(err.message);
      logger.error('sendToEmail Error : ', err.stack);
      return false;
    }
  },

  sendResult: async function () {},
};
module.exports = mailSender;

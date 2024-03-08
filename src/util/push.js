const logger = require('./logger');
const admin = require('firebase-admin');

let serviceAccount = require('../../gooners-app-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const pushSender = {
  sendToPush: async function ({ pushOption }) {
    admin
      .messaging()
      .send(pushOption)
      .then(function (response) {
        console.log('Push Success: ', response);
      })
      .catch(function (err) {
        console.error('Push Error: ', err);
        logger.error('Push Error : ', err.stack);
      });

    return pushOption;
  },
};

module.exports = pushSender;

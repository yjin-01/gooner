const admin = require('firebase-admin');

let serviceAccount = require('../../gooners-app-firebase-adminsdk.json');

const pushSender = {
  sendToPush: async function ({ pushOption }) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    admin
      .messaging()
      .send(pushOption)
      .then(function (response) {
        console.log('Push Success: ', response);
        return res.status(200).json({ success: true });
      })
      .catch(function (err) {
        console.error('Push Error: ', err);
        return res.status(400).json({ success: false });
      });
  },
};

module.exports = pushSender;

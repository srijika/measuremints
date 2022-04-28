const firebase = require("firebase-admin");
const db = require('../../db/conn');
const UserLogins = db.UserLogins;
const serviceAccount = require('./secret.json');
module.exports = {

  sendMintRequestNotification(status,title, firebase_token,) {

    try {
      if (!firebase.apps.length) {
      firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
      });
    }

      const payload = {
        notification: {
         
          title: title,
          sound: "default",
          click_action: "FLUTTER_NOTIFICATION_CLICK",
          
        },
        data: {
          status:status,  
        }
      };

      const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24, // 1 day
      };

      if (firebase_token !== null || firebase_token !== undefined) {
        firebase.messaging().sendToDevice(firebase_token, payload, options).then(function (response) {
          return console.log("Successfully sent message: ", response);
        })
          .catch(function (error) {
            return console.log("Error sending message: ", error);
          });
      }

      data = { message: "successfully send message" }

      return data;
    } catch (e) {
      console.log("error", e);
      return e;
    }
  },
}



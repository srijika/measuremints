const db = require('../db/conn');
const {Notification } = db;

module.exports = function generateOTP(user_id, message , notification_type , media) {

    const jsonData = {
        user_id: user_id,
        message: message,
        notification_type : notification_type ,
        media:media

    };
    Notification.create(jsonData).then((data) => {
        console.log('notification generated successfully')
        
    }).catch((err) => {
        console.log(err.message)

    }); 
}
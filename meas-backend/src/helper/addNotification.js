const db = require('../db/conn');
const {Notification } = db;

module.exports = function generateOTP(user_id, message) {

    const jsonData = {
        user_id: user_id,
        message: message,

    };
    Notification.create(jsonData).then((data) => {
        console.log('notification generated successfully')
        
    }).catch((err) => {
        console.log(err.message)

    }); 
}
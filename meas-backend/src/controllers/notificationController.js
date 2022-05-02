const db = require('../db/conn');
const {Notification } = db;
const mongoose = require("mongoose");


module.exports = {

    addNotification: async (req, res, next) => {

        const { user_id, message} = req.body;
        if (!user_id || !message) {
            res.send({ status: 400, message: "Required Parameter is missing" });
            return;
        }

        const jsonData = {
            user_id: user_id,
            message: message,

        };

       

        Notification.create(jsonData).then((data) => {
            res.send({ status: 200, message: "Send Notification Successfully" })
            return;
        }).catch((err) => {
            res.send({ status: 400, message: err.errmsg })
            return;
        }); 

    },

    removeNotification: async (req, res, next) => {
        const { _id} = req.body;
        if (!_id ) {
            res.send({ status: 400, message: "Required Parameter is missing" });
            return;
        }
        const removeData = {
            _id: _id,
        };

        Notification.deleteOne(removeData).then((data) => {
            res.send({ status: 200, message: "Notification Remove Successfully" })
        }).catch((err) => {
            res.send({ status: 400, message: err.message })
            return;
        });
    },

    getMyNotification: async(req, res, next) => {
        try{
        const { user_id } = req.body;

        if (!user_id) {
            res.send({ status: 400, message: "Required Parameter is missing" });
            return;
        }


        let conditions = { user_id: user_id } 
        let update = { $set: { status: 1 }}

    Notification.updateMany(conditions, update).then(async(updatedRows)=>{
    const NotificationList = await Notification.find(conditions)
    res.send({ status: 200, NotificationList : NotificationList,message: `Get NotificationList Successfully` })

  
}).catch(err=>{
  console.log(err)
  
})


}catch(error){
    res.send({status: 400, message: error.message})
    return;
}

    },


    getMyUnreadNotification: async(req, res, next) => {
        try{
        const { user_id } = req.body;

        if (!user_id) { 
            res.send({ status: 400, message: "Required Parameter is missing" });
            return;
        }


        let conditions = { user_id: user_id ,  status: 0} 

        const NotificationList = await Notification.find(conditions)
        const NotificationCount = await Notification.find(conditions).countDocuments()

        res.send({ status: 200, NotificationCount: NotificationCount ,NotificationList : NotificationList,message: `Get Unread NotificationList Successfully` })


}catch(error){
    res.send({status: 400, message: error.message})
    return;
}

    },

   
}

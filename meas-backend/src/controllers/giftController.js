const db = require('../db/conn');
const {Gifts } = db;
const mongoose = require("mongoose");


module.exports = {

    sendGift: async (req, res ) => {
        try {
            const {
                sender_id,
                reciever_id,
                gift_name, 
                gift_link,
                firebase_token
            } = req.body;

            if (!sender_id)
                return res.send({
                    status: 400,
                    message: "Sender Id is required"
                });
            if (!gift_name)
                return res.send({
                    status: 400,
                    message: "Gift Name is required"
                });
            if (!gift_link)
                return res.send({
                    status: 400,
                    message: "Gift Link is required"
                });

            if (!reciever_id)
                return res.send({
                    status: 400,
                    message: "Reciever Id is required"
                });

            let giftData = {
                sender_id: sender_id,
                reciever_id: reciever_id,
                gift_name: gift_name,
                gift_link: gift_link,
                send_date: new Date()
            };

            const sentGiftData = await Gifts(giftData).save();

            return res.send({
                status: 200,
                Gift: sentGiftData,
                message: 'Gift Sent Successfully'
            });


        } catch (error) {

            return res.send({
                status: 400,
                message: error.message
            })
        }
    },
   
}

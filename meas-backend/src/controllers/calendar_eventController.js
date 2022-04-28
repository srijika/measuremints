const db = require('../db/conn');
const {Sub_Category , Mint , Attribute, Calendar_Event } = db;
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const imagePath = require('../helper/imagePath');
var mongoose = require('mongoose');
const console = require('console');




module.exports = {
    createCalendar: async (req, res, next) => {
        try{
            const { eventDescription,date,time,reminders,user_id} = req.body;
            if (!user_id || !eventDescription || !date || !time ||!reminders ) {
                res.send({ status: 200, message: "Required Parameter is missing" });
                return;
            }
            const Event_data = {
                user_id : user_id,
                event_detail : eventDescription,
                reminders : reminders,
                date: date,
                time: time,
            }

            Calendar_Event.create(Event_data)
            .then((data) => {
                res.send({ status: 200, message: `Event Created Successfully` })
                return;
            }).catch((err) => {
                res.send({ status: 400, message: err.message })
                return;
            });
        }catch(error){
            res.send({status: 400, message: error})
            return;
        }
        

    },
    getCalendar: async (req, res, next) => {
        try{
            const { user_id } = req.body
            if(!user_id){
                res.send({status: 200, message: "Required parameter is missing"})
                return;
            }
            Calendar_Event.find({user_id: mongoose.Types.ObjectId(user_id)})
            .then( data => {
                console.log(data)
                res.send({status: 200, EventData: data})
                return;
            })
            .catch(error => {
                res.send({status: 400, message: error})
                return;
            })
        }catch(error){
            res.send({status: 400, message: error})
            return;
        }
    }
}

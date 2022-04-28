const db = require('../db/conn');
const {Mint_Requests, UserLogins} = db;
var mongoose = require('mongoose');
const {
    sendMintRequestNotification
} = require('../helper/firebase/firebase');
const mints = require('../models/mints');
const { promises } = require('nodemailer/lib/xoauth2');


module.exports = {
    sendMintRequest: async (req, res, next) => {
        try {
            const {
                sender_id,
                reciever_id
            } = req.body;

            const d = new Date();

            if (!sender_id)
                return res.send({
                    status: 400,
                    message: "Sender Id is required"
                });
            if (!reciever_id)
                return res.send({
                    status: 400,
                    message: "Reciever Id is required"
                });

            const data = {
                sender_id: sender_id,
                reciever_id: reciever_id,
                send_date: d,
                accepted_date: null

            };



            const isRequest = await Mint_Requests
                .findOne({
                    $and: [{
                        sender_id: sender_id
                    }, {
                        reciever_id: reciever_id
                    }]
                })
                .lean().exec();

            const senderInfo = await UserLogins.findOne({
                '_id': sender_id
            });
            const recieverInfo = await UserLogins.findOne({
                '_id': reciever_id
            });
            let firebase_token = recieverInfo.firebase_token;

            if (isRequest) {
                return res.send({
                    status: 400,
                    message: 'Request Already Sent!'
                });
            }

            if(recieverInfo.isNotification === true){
            
            let ff =  await sendMintRequestNotification("207", `${senderInfo.username} send a Mint request on Measuremints app.`, firebase_token);
            console.log("ff" , ff)

            }
         
            const MintRequestCreate = await (new Mint_Requests(data)).save();
            return res.send({
                status: 200,
                message: 'Mint Request sent successfully'
            });


        } catch (error) {

            return res.send({
                status: 400,
                message: error.message
            })
        }
    },
    acceptMintRequest: async (req, res, next) => {

        try {

            const {
                accepter_id,
                requester_id,
                accept_status,
            } = req.body;

            const d = new Date();
            // validation 
            if (!requester_id)
                return res.send({
                    status: 400,
                    message: "Requester Id is required"
                });
            if (!accepter_id)
                return res.send({
                    status: 400,
                    message: "Accepter Id is required"
                });
            if (!accept_status)
                return res.send({
                    status: 400,
                    message: "Accept Status is required"
                });
            console.log("if condiotion--", accept_status, accept_status === true);

            // if request accepted
            console
            if (accept_status == 'true') {

                Mint_Requests.findOne({
                    $and: [{
                        sender_id: requester_id
                    }, {
                        reciever_id: accepter_id
                    }]
                }).then(async (data) => {

                    //Send Notification
                    const accepterInfo = await UserLogins.findOne({
                        '_id': accepter_id
                    });
                    const requesterInfo = await UserLogins.findOne({
                        '_id': requester_id
                    });

                    let firebase_token = requesterInfo.firebase_token;
                    if(requesterInfo.isNotification === true){
                        let result = await sendMintRequestNotification("207", `${accepterInfo.username} accept your Mint request`, firebase_token);
                    }


                    Mint_Requests.updateOne({
                        _id: data._id
                    }, {
                        $set: {
                            accepted_date: d,
                            accept_status: true
                        }
                    }).then(async data2 => {
                        return res.send({
                            status: 200,
                            message: "Mint Request Accepted"
                        });
                    });
                }).catch(err => {
                    return res.send({
                        status: 400,
                        message: "Record not found!"
                    })

                })


            } else {
                console.log("else condiotion--");

                const deleted = await Mint_Requests.findOneAndRemove({
                    $and: [{
                        sender_id: requester_id
                    }, {
                        reciever_id: accepter_id
                    }]
                }).lean().exec();
                return res.send({
                    status: 200,
                    message: "Mint Request Rejected"
                });
            }
        } catch (error) {

            return res.send({
                status: 400,
                message: error.message
            })
        }


    },
    getAllMintRequests: async (req, res, next) => {
        
        try {
            const {
                user_id,
            } = req.body;

            const d = new Date();
            // validation 
            if (!user_id)
                return res.send({
                    status: 400,
                    message: "User Id is required"
                });

            const myFriends = await Mint_Requests.find({
                $or: [{
                    sender_id: user_id
                }, {
                    reciever_id: user_id
                }],
                $and: [{
                    accept_status: false
                }]
            }).lean().exec();

            const myFriendsList = [];
            myFriends.map(async (item) => {
                    if (user_id != item.sender_id) {
                        myFriendsList.push(item.sender_id);

                    }
                }

            );
            // const mypractice = await UserLogins.aggregate([{
            //     $lookup: {
            //         from: "mints",
            //         localField: "_id",
            //         foreignField: "username_id"
            //     }
            // }])
            // console.log(mypractice)

            const userList = await UserLogins.find({
                '_id': {
                    $in: myFriendsList
                }
            });
            // console.log(userList)
            return res.send({
                status: 200,
                allMintRequests: userList
            });


        } catch (error) {

            return res.send({
                status: 400,
                message: error.message
            })
        }
    },

    myAllMints: async (req, res, next) => {

        try {

            const {
                user_id,
            } = req.body;

            const d = new Date();
            // validation 
            if (!user_id)
                return res.send({
                    status: 400,
                    message: "User Id is required"
                });

            const myFriends = await Mint_Requests.find({
                $or: [{
                    sender_id: user_id
                }, {
                    reciever_id: user_id
                }],
                $and: [{
                    accept_status: true
                }]
            }).lean().exec();

            const myFriendsList = [];
            myFriends.map(async (item) => {
                    myFriendsList.push(item.reciever_id);
                }
            );
            myFriends.map(async (item) => {
                    myFriendsList.push(item.sender_id);
                }
            );
            let filterFriend = myFriendsList.filter((val) => {
                return val != user_id
            })

            const userList = await UserLogins.find({
                '_id': {
                    $in: filterFriend
                }
            });

            var filterByNames = userList.sort((a, b) => a.username.localeCompare(b.username))
            var friendsData = filterByNames.map(v=>{
                return {
                    name: v.username,
                    id: v._id
                }
            })
            return res.send({
                status: 200,
                myAllFriends: filterByNames,
                friendsName: friendsData
            });

        } catch (error) {

            return res.send({
                status: 400,
                message: error.message
            })
        }
    },
}

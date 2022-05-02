const db = require('../db/conn');
const {Mint_Requests, UserLogins} = db;
var mongoose = require('mongoose');
const {
    sendMintRequestNotification
} = require('../helper/firebase/firebase');
const mints = require('../models/mints');
const { promises } = require('nodemailer/lib/xoauth2');
const addNotification = require('../helper/addNotification');



module.exports = {
    sendMintRequest: async (req, res, next) => {
        try {
            const {
                sender_id,
                reciever_id ,
                subcategory_attribte
            } = req.body;
            console.log(typeof(reciever_id))

            let subcategory_tags =JSON.parse(subcategory_attribte)


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
                accepted_date: null,
                subcategory_attribte: subcategory_tags,

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


            const MintRequestCreate = await (new Mint_Requests(data)).save();

            let message = `${senderInfo.username} send a mint request.`;
            let notification_type = 'request'
            let media = recieverInfo.avatar
            // normal  notification
            await addNotification(recieverInfo._id , message , notification_type ,media);
            if(recieverInfo.isNotification === true){
            // firebase  notification
            await sendMintRequestNotification("207", `${senderInfo.username} send a mint request.`, firebase_token);
                
                }
             

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

            // if request accepted
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
                    let message = `${accepterInfo.username} accept your mint request.`;
                    let notification_type = 'accept'
                    let media = accepterInfo.avatar
                    // normal  notification
                    await addNotification(requesterInfo._id , message , notification_type ,media);
                    if(requesterInfo.isNotification === true){
                    // firebase  notification
                    await sendMintRequestNotification("207", `${accepterInfo.username} send a mint request.`, firebase_token);
                        
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

    // myAllMintsFriend: async (req, res, next) => {

    //     try {

    //         const {
    //             user_id,
    //         } = req.body;

    //         const d = new Date();
    //         // validation 
    //         if (!user_id)
    //             return res.send({
    //                 status: 400,
    //                 message: "User Id is required"
    //             });

    //         const myFriends = await Mint_Requests.find({
    //             $or: [{
    //                 sender_id: user_id
    //             }, {
    //                 reciever_id: user_id
    //             }],
    //             $and: [{
    //                 accept_status: true
    //             }]
    //         }).lean().exec();

    //         const myFriendsList = [];
    //         myFriends.map(async (item) => {
    //                 myFriendsList.push(item.reciever_id);
    //             }
    //         );
    //         myFriends.map(async (item) => {
    //                 myFriendsList.push(item.sender_id);
    //             }
    //         );
    //         let filterFriend = myFriendsList.filter((val) => {
    //             return val != user_id
    //         })

    //         const userList = await UserLogins.find({
    //             '_id': {
    //                 $in: filterFriend
    //             }
    //         });

    //         var filterByNames = userList.sort((a, b) => a.username.localeCompare(b.username))
    //         var friendsData = filterByNames.map(v=>{
    //             return {
    //                 name: v.username,
    //                 id: v._id
    //             }
    //         })
    //         return res.send({
    //             status: 200,
    //             myAllFriends: filterByNames,
    //             friendsName: friendsData
    //         });

    //     } catch (error) {

    //         return res.send({
    //             status: 400,
    //             message: error.message
    //         })
    //     }
    // },
    myAllMintsFriend: async (req, res, next) => {

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

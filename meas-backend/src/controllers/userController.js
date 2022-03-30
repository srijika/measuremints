const db = require('../db/conn');
const {UserLogins} = db;
var ROLES = require('../../config.json').ROLES;








module.exports = {
    //Users//
    getalluser: async (req, res, next) => {

        try {
            const reqBody = req.body;
            console.log(reqBody);
            const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
            const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;
            const sortColumn = reqBody.sortColumn ? reqBody.sortColumn : 'updated';
            const sortType = reqBody.sortType ? (reqBody.sortType == 'asc' ? 1 : -1) : -1;
            let role = reqBody.role;

            if (role && !ROLES.includes(role)) {
                return res.send({
                    status: 400,
                    message: "Not valid role"
                });
            }

            const MATCH = {};
            MATCH.$or = [];
            MATCH.$and = [];

            if (role) {
                MATCH.$and.push({
                    roles: role
                });
            }

            if (!MATCH.$or.length) {
                delete MATCH.$or;
            }
            if (!MATCH.$and.length) {
                delete MATCH.$and;
            }

            const data = await UserLogins.aggregate([


                {
                    $match: MATCH
                },
                {
                    $sort: {
                        [sortColumn]: sortType
                    }
                },
                {
                    $skip: (Limit * PageNo)
                },
                {
                    $limit: Limit
                }
            ]);

            const countUser = await UserLogins.aggregate([


                {
                    $match: MATCH
                },
            ]);


            return res.send({
                status: 200,
                data: data,
                total: countUser.length,
                message: 'Users get successfully'
            });
        } catch (error) {
            return res.send({
                status: 400,
                message: error.message
            });
        }
    },
    userActive: async (req, res, next) => {
        let _id = req.body._id


        let isuser = await UserLogins.findById({
            _id
        });
        if (isuser) {
            if (isuser.user_status === "active") {
                res.status(200).send({
                    status: true,
                    user_status: isuser.user_status

                });
            } else {
                res.send({
                    status: false,
                });
            }
        } else {
            res.send({
                status: false,
            });
        }



    },
    userActiveDeactiveStatus: async (req, res, next) => {
        try {
            let {
                id
            } = req.body;

            UserLogins.findById(id, function (err, data) {
                data.user_status = !data.user_status;
                data.save((err, result) => {
                    if (result) {
                        return res.send({
                            status: 200,
                            message: "User action changed successfully"
                        });
                    } else {
                        return res.send({
                            status: 400,
                            message: err
                        });
                    }
                })
            });

        } catch (e) {
            console.log(e);
            return res.send({
                status: 400,
                message: e.message
            });
        }
    },
    getprofile: async (req, res, next) => {

        try {
            const profileId = req.body.profile_id;

            if (!profileId) {
                return res.send({
                    status: 400,
                    message: 'Profile Id is required'
                });
            }

            let profile = await UserLogins.findById(profileId).lean().exec();

            if (!profile) {
                return res.send({
                    status: 400,
                    message: 'User not found'
                });
            }

            const user = await UserLogins.findOne({
                _id: profileId
            }).exec();


            profile.name = user.username;

            return res.send({
                status: 200,
                userLogin: user,
                profile
            });

        } catch (error) {
            return res.send({
                status: 400,
                message: error.message
            });
        }
    },

    editprofile: async (req, res, next) => {

        try {

            const {
                user_id,
                name
            } = req.body;
            let avatar = null;

            if (!user_id) {
                return res.status(501).send({
                    status: 400,
                    message: 'User Id is required'
                });
            }


            if (req.files[0] && req.files[0].location && req.files[0].location != 'undefined') {
                avatar = req.files[0].location;
            }

            let profile = await UserLogins.findById(user_id).lean().exec();


            if (!profile) {
                return res.status(501).send({
                    status: 400,
                    message: 'User not found'
                });
            }


            const user = await UserLogins.updateOne({
                _id: user_id
            }, {
                username: name,
                avatar: avatar
            }).then((data) => {

            });

            return res.status(200).send({
                status: 200,
                message: "Profile updated successfully!"
            });

        } catch (error) {
            return res.status(400).send({
                status: 400,
                message: error.message
            });
        }
    },
    updateUserProfile: async (req, res, next) => {

        try {
            const {
                _id,
                name,
                biography,
                age,
                dob,
                address,
                latitude,
                longitude
            } = req.body;




            if (!name) {
                res.send({
                    status: 400,
                    message: "Required Parameter is missing"
                });
                return;
            }
            console.log("req.body", req.body)

            UserLogins.findOne({
                _id: req.body._id
            }).then(async (data) => {

                if (data && data._id) {
                    const userData = {
                        username: name,
                        age: age,
                        dob: dob,
                        address: address,
                        latitude: latitude,
                        longitude: longitude,
                        location: {
                            "type": "Point",
                            "coordinates": [
                                latitude,
                                longitude
                            ]
                        },
                        biography: biography


                    }




                    let avatar

                    if (req.files && req.files[0] && req.files[0].location) {
                        userData['avatar'] = req.files[0].location;
                        avatar = req.files[0].location;
                    }



                    let result = await UserLogins.findByIdAndUpdate({
                        _id: _id
                    }, userData)

                    if (avatar !== undefined || avatar !== null) {
                        const user = await UserLogins.findOne({
                            _id: _id
                        })
                        console.log("user", user)

                        return res.send({
                            status: 200,
                            user: user,
                            message: "User Profile updated successfully"
                        });

                    } {
                        const user = await UserLogins.findOne({
                            _id: _id
                        })
                        return res.send({
                            status: 200,
                            user: user,
                            avatar,
                            message: "User Profile updated successfully"
                        });

                    }

                }

            });

        } catch (error) {
            return res.send({
                status: 400,
                message: error.message
            });
        }

    },
    adminupdateprofile: async (req, res, next) => {
        try {

        
        const {
           name,
        } = req.body;

        if (!name) {
            res.send({
                status: false,
                message: "Required Parameter is missing"
            });
     
        }
    
        UserLogins.findOne({
            _id: req.user._id
        }).then((data) => {
        
            if (data && data._id) {
                req.body['updated'] = new Date();

                let avatar = null;
                const data = {
                    username: req.body.name,

                }
                if (req.files && req.files[0] && req.files[0].location) {
                    data['avatar'] = req.files[0].location;
                }

             
        
                UserLogins.updateOne({
                    _id: req.user._id
                }, data).then((data) => {
                    return res.send({
                        status: 200,
                        data
                    });

                }).catch((err) => {
                    return res.send({
                        status: 400,
                        message: err.errmsg
                    });

                });
            }

        })}
        catch (e) {
            return res.status(400).send({
                status: 200,
                message: e.message
            });
        }

    },

    getUserDetail: async (req, res, next) => {
        console.log("coming")
        try {
            let user = await UserLogins.findById(req.body.user_id).lean().exec();

            return res.status(200).send({
                status: 200,
                user: user,
            });
        } catch (e) {
            return res.status(400).send({
                status: 200,
                message: e.message
            });
        }

    },
    deleteuser: async (req, res, next) => {
        try {
            const {
                _id
            } = req.body;
            if (!_id) {
                res.send({
                    status: 400,
                    message: "Not valid id"
                });
                return;
            }

            const deleteUser = await UserLogins.findByIdAndDelete(_id);
            if (!deleteUser) {
                return res.send({
                    status: 400,
                    message: 'User not found'
                })
            }
            const deleteProfile = await Profile.findOneAndDelete({
                loginid: _id
            });
            return res.send({
                status: 200,
                message: 'User deleted successfully'
            });

        } catch (error) {
            return res.send({
                status: 400,
                message: error.message
            })
        }
    },

    }
const db = require('../db/conn');
const {Sub_Category , Mint , UserLogins } = db;
const otp = db.Otp;
const generateOTP = require('../helper/otp_generate');
const accessTokenSecret = require('../../config.json').jwd_secret;
var ROLES = require('../../config.json').ROLES;
const jwt = require('jsonwebtoken');
let mongoose = require('mongoose')
let bcrypt = require('bcrypt');
const Helper = require('../helper/helper');
const imagePath = require('../helper/imagePath');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');



let saltRounds = 10;
let block_user_messsage = `Your Account has been deactivated.`;


module.exports = {
//Users//
    signup: async (req, res, next) => {
        try {
            const {

                email,
                password,
                roleType,
                name,
                dob,
                mobile_number,
                firebase_token

            } = req.body;
        let reqFiles = req.files;





            if (!email)
                return res.send({
                    status: 400,
                    message: "Email is required"
                });

            if (!password)
                return res.send({
                    status: 400,
                    message: "Password is required"
                });
            const hash = bcrypt.hashSync(password, saltRounds);

            const userOtp = generateOTP();

            let data = {
                email: email,
                dob: dob,
                username: name,
                mobile_number: mobile_number,
                password: hash,
                roles: roleType,
                otp: userOtp,
                isEmailVerified: true,
                firebase_token: firebase_token
            };

             //Multer
        let filename;
        if(reqFiles.length > 0) {

            reqFiles.forEach(E => {
                var filePath = path.join(__dirname, '../../public/users/');
                if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath);
            }
            
            const fileUrl = filePath + E.filename;
            sharp(E.path).toFile(fileUrl, function (err) {
                if (err) {
                    console.log(err)
                }
            });      
            filename = `${imagePath}/users/${E.filename}`;
            });
        }
       

        data.avatar = filename

            //Multer S3 Bucket    
            // if (req.files && req.files[0] && req.files[0].location) {
            //     data['avatar'] = req.files[0].location;
            //     avatar = req.files[0].location;
            // }

            const isUser = await UserLogins
                .findOne({
                    $or: [{
                        email: email
                    }]
                })
                .lean().exec();

            const isUserMobile = await UserLogins
                .findOne({
                    $or: [{
                        mobile_number: mobile_number
                    }]
                })
                .lean().exec();

            if (isUser) {
                let msg = 'This';
                if (isUser.email === email) {
                    msg += ' Email';
                }
                msg += ' is already registered';

                return res.send({
                    status: 400,
                    message: msg
                });
            }

            if (isUserMobile) {
                let msg = 'This';
                if (isUserMobile.mobile_number === mobile_number) {
                    msg += ' Mobile No.';
                }
                msg += ' is already registered';

                return res.send({
                    status: 400,
                    message: msg
                });
            }

            const userLoginCreate = await (new UserLogins(data)).save();
            let jsonData = {
                username: name, 
                dob: dob,
                relation: "Me", 
                user_id : userLoginCreate._id ,
                username_id : userLoginCreate._id 
            };
            jsonData.media = filename

            //User Mint
            const userMintCreate = await (new Mint(jsonData)).save();

            let isUser1 = await UserLogins.findOne({
                $or: [{
                    email: userLoginCreate.email
                }]
            }).lean().exec();

            isUser1 = {
                username: isUser1.email,
                _id: isUser1._id,
                time: new Date().getTime(),
                role: isUser1.roles
            };

            const accessToken = jwt.sign(isUser1, accessTokenSecret);
            let msg_body = 'Hi, <br />';
            msg_body += 'Your account has been added on Measuremints App <br />';
            msg_body += 'Please find below your login credentials:<br />';
            msg_body += 'Email: ' + email + '<br />';
            msg_body += 'Password: ' + password + '<br />';
            msg_body += '<br />Thanks,<br />Measuremints Team';
            await Helper.sendEmail(email, 'Measuremint App', msg_body);
            return res.send({
                status: 200,
                user: userLoginCreate,
                accessToken: accessToken,
                message: `${roleType} Sign Up Successfully`
            });


        } catch (error) {
            if (error.errmsg && error.errmsg.indexOf('E11000') > -1) {
                return res.send({
                    status: 403,
                    message: "User Already Exist, Please try with other username or email"
                })
            }

            return res.send({
                status: 400,
                message: error.message
            })
        }
    },

    sendOtp: async (req, res, next) => {
        try {

            const {
                email,
                type
            } = req.body;
            if (!email)
                return res.status(400).send({
                    status: 400,
                    message: "Email is required"
                });

            const userOtp = generateOTP();
  
   

            let msg_body = 'Hi, <br />';
            msg_body += ' your OTP(One Time Password) is ' + userOtp;
            msg_body += '<br />Thanks,<br />';
            const isUser = await UserLogins.findOne({
                $or: [{
                    email: email
                }]
            }).lean().exec();

            if (isUser && type === 'register') {
                return res.status(400).send({
                    status: 400,
                    message: "user already registered on this email!"
                });
            }
             
            if (!isUser && type === 'register') {

                await Helper.sendEmail(email, 'New Signup', msg_body);
                return res.status(200).send({
                    status: 200,
                    Otp: userOtp
                });
            }
 
            if (isUser && type === 'forgot') {

                await Helper.sendEmail(email, 'Forgot Password', msg_body);
                return res.status(200).send({
                    status: 200,
                    Otp: userOtp
                });

            } else {
                return res.status(400).send({ 
                    status: 400,
                    message: "user not registered on this email!"
                });
            }


        } catch (error) {

            return res.status(400).send({
                status: 400,
                err: error.message
            })
        }

    },

    verifyOtp: async (req, res, next) => {
        try {
            const {
                mobile_number,
                userName,
                email,
                otp
            } = req.body;
            let isUser;


            if (!email && !userName && !mobile_number) {
                return res.send({
                    status: 400,
                    message: "Required parameter missing, Please provide email  or mobile number"
                });
            }

            if (!otp) {
                return res.send({
                    status: 400,
                    message: "OTP is required"
                });
            }

            if (email || userName) {
                isUser = await UserLogins.findOne({
                    $or: [{
                        email: email
                    }, {
                        username: userName
                    }]
                }).lean().exec();
                if (!isUser) {
                    return res.send({
                        status: 400,
                        message: "User not found"
                    });
                }

                if (isUser.otp == otp || isUser.mobile_otp == otp) {
                    await UserLogins.findByIdAndUpdate(isUser._id, {
                        isEmailVerified: true,
                        user_status: true
                    });

                    if (isUser.roles !== ROLES[3]) {
                        const accessToken = jwt.sign(isUser, accessTokenSecret);
                        return res.send({
                            status: 200,
                            message: "OTP Verified",
                            accessToken: accessToken,
                            userId: isUser._id
                        });
                    } else {
                        const userData = {
                            username: isUser.email,
                            _id: isUser._id,
                            time: new Date().getTime(),
                            role: isUser.roles
                        };
                        const accessToken = jwt.sign(isUser, accessTokenSecret);

                        await UserLogins.findByIdAndUpdate(isUser._id, {
                            $inc: {
                                no_of_loggedin: 1
                            },
                            last_login_time: new Date()
                        });
                        return res.send({
                            status: 200,
                            user: userData,
                            accessToken: accessToken
                        });
                    }

                } else {
                    return res.send({
                        status: 400,
                        message: "OTP Not Verified"
                    });
                }

            } else if (mobile_number) {
                const isUser = await UserLogins.findOne({
                    mobile_number: mobile_number
                }).lean().exec();

                if (!isUser) {
                    return res.send({
                        status: 400,
                        message: "User not found"
                    });
                }


                if (isUser.mobile_otp === otp) {
                    await UserLogins.findByIdAndUpdate(isUser._id, {
                        isMobileVerified: true
                    });

                    if (isUser.roles !== ROLES[3]) {
                        const accessToken = jwt.sign(isUser, accessTokenSecret);
                        return res.send({
                            status: 200,
                            message: "OTP Verified",
                            accessToken: accessToken,
                            userId: isUser._id
                        });
                    } else {
                        const userData = {
                            username: isUser.email,
                            _id: isUser._id,
                            time: new Date().getTime(),
                            role: isUser.roles
                        };
                        const accessToken = jwt.sign(isUser, accessTokenSecret);

                        await UserLogins.findByIdAndUpdate(isUser._id, {
                            $inc: {
                                no_of_loggedin: 1
                            },
                            last_login_time: new Date()
                        });
                        return res.send({
                            status: 200,
                            user: userData,
                            accessToken: accessToken
                        });
                    }

                } else {
                    return res.send({
                        status: 400,
                        message: "OTP Not Verified"
                    });
                }
            } else {
                return res.send({
                    status: 400,
                    message: "Something went wrong"
                });
            }


        } catch (e) {
            console.log(e)
            return res.send({
                status: 400,
                err: e.message
            })
        }
    },




    loginUser: async (req, res, next) => {
        const {
            username,
            password
        } = req.body;
        let userData = {}

        UserLogins.findOne({
            $or: [{
                email: username
            }]
        }).then((data) => {
            if (data && data._id) {
                userData = data

                let user = {
                    mobile_number: data.mobile_number,
                    avatar: data.avatar,
                    email: data.email,
                    name: data.username,
                    _id: data._id,
                    time: new Date().getTime(),
                    role: data.roles,
                    dob: data.dob,

                };
                const accessToken = jwt.sign(user, accessTokenSecret);
                let compare = bcrypt.compareSync(password, data.password);
                if (!compare) {
                    if (data.password === password) {
                        UserLogins.updateOne({
                            _id: data._id
                        }, {
                            $set: {
                                last_login_time: new Date()
                            }
                        }).then({});
                        res.status(200).json({
                            status: 200,
                            accessToken,
                            user,

                        });
                        return;
                    }

                    res.status(200).send({
                        status: 400,
                        message: "Invalid password!"
                    });
                } else {
                    UserLogins.updateOne({
                        _id: data._id
                    }, {
                        $set: {
                            last_login_time: new Date()
                        }
                    }).then({})

                    return res.status(200).json({
                        status: 200,
                        accessToken,
                        user: userData,
                    });

                }

            } else {
                res.status(200).send({
                    status: 400,
                    message: "email not found"
                });
            }
        })

    },

    userActive: async (req, res, next) => {
        let _id = req.body._id


        let isuser = await UserLogins.findById({
            _id
        });
        if (isuser) {
            if (isuser.user_status === "active") {
                res.status(200).send({
                    status: 200,
                    user_status: isuser.user_status

                });
            } else {
                res.send({
                    status: 400,
                });
            }
        } else {
            res.send({
                status: 400,
            });
        }



    },


    sendOtpToUser: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const Email = reqBody.email;
            const Username = reqBody.username;
            const mobileNumber = reqBody.mobile_number;

            if (!Email && !Username && !mobileNumber) {
                return res.send({
                    status: 400,
                    message: "Required parameter missing, Please provide email username or mobile number"
                });
            }

            const userOtp = generateOTP();

            if (Email || Username) {
                const isUser = await UserLogins.findOne({
                    $or: [{
                        email: Email
                    }, {
                        username: Username
                    }]
                });
                if (!isUser) {
                    return res.send({
                        status: 400,
                        message: "User not found"
                    });
                }

                if (isUser && isUser.deactive) {
                    return res.send({
                        status: 400,
                        message: block_user_messsage
                    });
                }


                let msg_body = `Hi, ${isUser.username} <br />`;
                msg_body += 'Your One Time Password is ' + userOtp;
                msg_body += '<br />Thanks,<br />Gali Nukkad Team';

                await UserLogins.findByIdAndUpdate(isUser._id, {
                    otp: userOtp
                }).lean().exec();
                Helper.sendEmail(isUser.email, "OTP Verification", msg_body);

                return res.send({
                    status: 200,
                    message: "OTP send to your email"
                });
            } else if (mobileNumber) {
                const isUser = await UserLogins.findOne({
                    mobile_number: mobileNumber
                });

                if (isUser && isUser.deactive) {
                    return res.send({
                        status: 400,
                        message: block_user_messsage
                    });
                }

                if (!isUser) {
                    return res.send({
                        status: 400,
                        message: "User not found"
                    });
                }

                await sendSms(mobileNumber, `${userOtp} is your OTP for Login Transaction on Galinukkad and valid till 10 minutes. Do not share this OTP to anyone for security reasons.`);

                await UserLogins.findByIdAndUpdate(isUser._id, {
                    mobile_otp: userOtp
                }).lean().exec();
                return res.send({
                    status: 200,
                    message: "OTP send to your Phone No."
                });
            } else {
                return res.send({
                    status: 400,
                    message: "Something went wrong"
                });
            }

        } catch (error) {
            return res.send({
                status: 400,
                err: e.message
            });
        }
    },

    sendOtpCustomer: async (req, res, next) => {

        console.log(req.body);
        try {

            let {
                phone,
                email
            } = req.body;

            let mobileVerified = await UserLogins.findOne({
                mobile_number: phone,
                isMobileVerified: true
            });

            if (mobileVerified) {
                return res.send({
                    status: 400,
                    message: "Mobile number already registered."
                });
            }

            let user = await UserLogins.find({
                email: email
            });
            if (user) {
                const generated_otp = generateOTP();
                await sendSms(phone, generated_otp + ' is your OTP for Login Transaction on Galinukkad and valid till 10 minutes. Do not share this OTP to anyone for security reasons.');

                let set_update = {
                    mobile_otp: generated_otp,
                    mobile_number: phone,
                }

                let user_login_id = await UserLogins.updateOne({
                    email: email
                }, {
                    $set: set_update
                }).then({});

                return res.send({
                    status: 200,
                    message: "OTP has been send successfully."
                });
            }
        } catch (e) {
            console.log(e);
            return res.send({
                status: 400,
                message: e.message
            });
        }
    },


    verifyOTPCustomer: async (req, res, next) => {


        try {

            let {
                phone,
                email,
                mobile_otp
            } = req.body;
            console.log(req.body);

            let user_find = await UserLogins.find({
                email: email,
                mobile_otp: mobile_otp
            });

            if (user_find != undefined && user_find != "" && user_find != null) {
                await UserLogins.updateOne({
                    email: email,
                    mobile_number: phone,
                    mobile_otp: mobile_otp
                }, {
                    $set: {
                        isMobileVerified: true
                    }
                }).then({});
                return res.send({
                    status: 200,
                    message: "Mobile number verified successfully"
                });
            } else {
                return res.send({
                    status: 400,
                    message: "Please enter valid otp"
                });
            }
        } catch (e) {
            console.log(e);
            return res.send({
                status: 400,
                message: e.message
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


    recoverPasswordUser: async (req, res, next) => {
        try {
            const {
                email,
                password,
            } = req.body;
            if (!email || !password) {
                return res.status(500).send({
                    status: 400,
                    message: "please provide required params"
                })
            }

            const isUser = await UserLogins.findOne({
                email: email
            });


            if (!isUser) {
                return res.status(400).send({
                    status: 400,
                    message: "User not found"
                });
            }

            const hashPassword = bcrypt.hashSync(password, saltRounds);

            await UserLogins.findByIdAndUpdate(isUser._id, {
                password: hashPassword
            });


            return res.status(200).send({
                status: 200,
                message: 'Password updated successfully Please Login !'
            });

        } catch (error) {
            return res.status(400).send({
                status: 400,
                message: error.message
            });
        }

    },
    getalluser: async (req, res, next) => {

        try {
            const reqBody = req.body;
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

            const data = await UserLogins.aggregate([{
                    $lookup: {
                        from: 'profiles',
                        localField: '_id',
                        foreignField: "loginid",
                        as: "profileInfo"
                    }
                },
                {
                    $lookup: {
                        from: 'shops',
                        localField: '_id',
                        foreignField: "user_id",
                        as: "shopInfo"
                    }
                },

                {
                    $unwind: {
                        path: '$profileInfo',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        roles: 1,
                        id: 1,
                        email: 1,
                        gstin: 1,
                        fssai: 1,
                        mobile_number: 1,
                        isEmailVerified: 1,
                        username: 1,
                        'shop_name': "$shopInfo.shop_name",

                        'name': "$profileInfo.name",
                        'photo': "$profileInfo.photo",
                        'create': "$profileInfo.create",
                        'updated': "$profileInfo.updated",
                        user_status: 1,
                    }
                },
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

            const countUser = await UserLogins.aggregate([{
                    $lookup: {
                        from: 'profiles',
                        localField: '_id',
                        foreignField: "loginid",
                        as: "profileInfo"
                    }
                },
                {
                    $unwind: {
                        path: '$profileInfo',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        roles: 1,
                        id: 1,
                        email: 1,
                        gstin: 1,
                        fssai: 1,
                        mobile_number: 1,
                        isEmailVerified: 1,
                        isBussinessVerified: 1,
                        username: 1,
                        'name': "$profileInfo.name",
                        'photo': "$profileInfo.photo",
                        'create': "$profileInfo.create",
                        'user_status': {
                            $cond: {
                                if: {
                                    $eq: ["$user_status", "deactive"]
                                },
                                then: "deactive",
                                else: "active"
                            }
                        },
                    }
                },
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

    forgotpassword: async (req, res, next) => {
        try {
            const {
                username
            } = req.body;
            const newOtp = generateOTP();

            if (!username) {
                return res.send({
                    status: 400,
                    message: "please provide email"
                });
            }

            const isUser = await UserLogins.findOne({
                $or: [{
                    email: username
                }]
            });

            if (!isUser) {
                return res.send({
                    status: 400,
                    message: "User not found"
                });
            }
            if (isUser && isUser.deactive) {
                return res.send({
                    status: 400,
                    message: block_user_messsage
                });
            }

            if (isUser.deactive && isUser.roles != "ADMIN") {
                return res.send({
                    status: 400,
                    message: block_user_messsage
                });
            }

            const isOtp = await otp.findOneAndUpdate({
                loginid: isUser._id
            }, {
                $inc: {
                    attempt: 1
                },
                otp: newOtp
            });

            if (!isOtp) {
                const json = {
                    loginid: isUser._id,
                    otp: newOtp
                };
                await (new otp(json)).save();
            }

            Helper.sendEmail(isUser.email, `Your Verification code`, `Your verification code to reset your password is ${newOtp}.`);
            return res.send({
                status: 200,
                message: "Otp sent to your email address"
            });

        } catch (error) {
            return res.send({
                status: 400,
                message: error.message
            });
        }


    },

    forgotpasswordmobile: async (req, res, next) => {
        try {
            const {
                username
            } = req.body;
            const newOtp = generateOTP();

            if (!username) {
                return res.status(400).send({
                    status: 400,
                    message: "please provide email"
                });
            }

            const isUser = await UserLogins.findOne({
                $or: [{
                    email: username
                }]
            });

            if (!isUser) {
                return res.status(400).send({
                    status: 400,
                    message: "User not found"
                });
            }
            if (isUser && isUser.deactive) {
                return res.status(400).send({
                    status: 400,
                    message: block_user_messsage
                });
            }

            if (isUser.deactive && isUser.roles != "ADMIN") {
                return res.status(400).send({
                    status: 400,
                    message: block_user_messsage
                });
            }

            const isOtp = await otp.findOneAndUpdate({
                loginid: isUser._id
            }, {
                $inc: {
                    attempt: 1
                },
                otp: newOtp
            });

            if (!isOtp) {
                const json = {
                    loginid: isUser._id,
                    otp: newOtp
                };
                await (new otp(json)).save();
            }

            let msg_body = `Hi, ${isUser.username}<br />`;
            msg_body += 'Please hit the Below link <br />';
            msg_body += `<a href="http://13.234.31.171/api/resetPasswordView/mobile?q=${isUser._id}">reset password</a>:<br />`;


            await Helper.sendEmail(isUser.email, `Your Verification code`, `Your verification code to reset your password is ${newOtp}`)

            // await Helper.sendEmail(isUser.email, 'Reset Password', msg_body);

            return res.status(200).send({
                status: 200,
                message: "Otp sent to your email address",
                otp: newOtp
            });

        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message
            });
        }


    },



 
    recoverpasswordfrommobile: async (req, res, next) => {
        try {

            const {
                id,
                password,
                confirm_password
            } = req.body;

            if (!password) {
                return res.send({
                    status: 400,
                    message: "please provide required params"
                })
            }

            if (password === confirm_password) {
                const isUser = await UserLogins.findOne({
                    $or: [{
                        _id: id
                    }]
                });

                if (!isUser) {
                    return res.send({
                        status: 400,
                        message: "User not found"
                    });
                }

                let current_password = isUser.password;

                const hashPassword = bcrypt.hashSync(password, saltRounds);
                await UserLogins.findByIdAndUpdate(isUser._id, {
                    password: hashPassword
                });
                return res.send({
                    status: 200,
                    message: 'Password updated successfully Please Login !'
                });
            } else {
                return res.send({
                    status: 200,
                    message: 'Password and Confirm password does not match!'
                });
            }



        } catch (error) {
            return res.send({
                status: 400,
                message: error.message
            });
        }



    },
    recoverpasswordmobileview: async (req, res, next) => {

        const {
            q
        } = req.query;

        res.render('resetPassword', {
            id: q,
        });

    },

    changepassword: (req, res, next) => {
        if (!password || !confirmpassword || !oldpassword) {
            res.send({
                status: 400,
                message: "please provide required params"
            })
            return;
        }
        let username = req.user.username;
        UserLogins.findOne({
            $or: [{
                email: username,
                password: oldpassword
            }, {
                username: username,
                password: oldpassword
            }]
        }).then(data => {
            if (data && data._id) {
                UserLogins.update({
                    $or: [{
                        email: username
                    }, {
                        username: username
                    }]
                }, {
                    password: password
                }).then(d => {

                    res.send({
                        status: 200,
                        message: "Updated"
                    })
                })

            }

        })
    },




    crateprofile: (req, res, next) => {

        const {
            email,
            phone,
            name,
            gender,
            dob,
            photo
        } = req.body;
        if (!email || !phone || !name || !gender || !dob || !photo) {
            res.send({
                status: 400,
                message: "Required Parameter is missing"
            });
            return;
        }

        Profile.create({
            email,
            phone,
            name,
            gender,
            dob,
            photo,
            loginid: req.user._id
        }).then((data) => {
            res.send({
                status: 200,
                data
            })
            return;
        }).catch((err) => {
            res.send({
                status: 400,
                message: "error Occured While create profile"
            })
            return;
        });

    },

    logout: (req, res, next) => {
        try {
            if (req.user) {
                req.user = null;
                return res.send({
                    status: 200,
                    message: 'Logout Successfully'
                });
            }
        } catch (error) {
            return res.send({
                status: 400,
                message: error.message
            });
        }
    },


    //ADMIN
    adminLogin: async (req, res, next) => {

        const {
            username,
            password,
            isOtp
        } = req.body;

        if (!isOtp) {
            res.send({
                status: false,
                message: "please provide isOtp"
            });
        } else {
            if (isOtp == 0) { // if is otp is false
                UserLogins.findOne({
                    $or: [{
                        email: username
                    }, ]
                }).then((data) => {

                    if (data && data._id) {


                        let user_detail = data;

                        let user = {
                            username: data.email,
                            _id: data._id,
                            time: new Date().getTime(),
                            role: data.roles
                        };
                        const accessToken = jwt.sign(user, accessTokenSecret);

                        let compare = bcrypt.compareSync(password, data.password);
                        if (!compare) {
                            if (data.password === password) {
                                UserLogins.updateOne({
                                    _id: data._id
                                }, {
                                    $set: {
                                        last_login_time: new Date()
                                    }
                                }).then({});
                                res.json({
                                    status: true,
                                    accessToken,
                                    user: data,
                                    user_detail: user_detail,
                                });
                                return;
                            }
                            res.send({
                                status: false,
                                message: "Invalid password!"
                            });
                        } else {
                            UserLogins.updateOne({
                                _id: data._id
                            }, {
                                $set: {
                                    last_login_time: new Date()
                                }
                            }).then({})
                            return res.json({
                                status: true,
                                accessToken,
                                user,
                                user_detail: user_detail,
                            });
                        }

                    } else {
                        res.send({
                            status: false,
                            message: "email not found"
                        });
                    }
                })
            } else if (isOtp == 1) { // if login by otp is true
                // let otp = Math.floor(1000 + Math.random() * 9000);
                console.log('otp is not false')
                let otp = generateOTP();

                if (username) {
                    UserLogins.findOne({
                        $or: [{
                            email: username
                        }]
                    }).then((data) => {
                        UserLogins.updateOne({
                            email: username
                        }, {
                            $set: {
                                otp: otp
                            }
                        }).then(user => {

                        }).catch(err => {
                            res.send({
                                status: false,
                                err: "An Error Occured"
                            })
                            return;
                        })
                    }).catch(err => {
                        res.send({
                            status: false,
                            err: "An Error Occured"
                        })
                        return;
                    });

                } else if (mobile_number) {
                    UserLogins.findOne({
                        $or: [{
                            mobile_number: mobile_number
                        }]
                    }).then((data) => {
                        UserLogins.updateOne({
                            mobile_number: mobile_number
                        }, {
                            $set: {
                                otp: otp
                            }
                        }).then(async user => {
                            await sendSms(mobile_number, generateOTP() + ' is your OTP for Login Transaction on Galinukkad and valid till 10 minutes. Do not share this OTP to anyone for security reasons.');


                            res.send({
                                status: true,
                                message: "Otp sent!"
                            })
                            return;
                        }).catch(err => {
                            res.send({
                                status: false,
                                err: "An Error Occured"
                            })
                            return;
                        })
                    }).catch(err => {
                        res.send({
                            status: false,
                            err: "An Error Occured"
                        })
                        return;
                    });
                }
            }
        }
    },
    adminrecoverpassword: async (req, res, next) => {
        try {
            const {
                username,
                old_password,
                password,
                otpchk
            } = req.body;



            if (!username || !password || !otpchk) {
                return res.send({
                    status: false,
                    message: "please provide required params"
                })
            }

            const isUser = await UserLogins.findOne({
                $or: [{
                    email: username
                }, {
                    username: username
                }]
            });

            if (!isUser) {
                return res.send({
                    status: false,
                    message: "User not found"
                });
            }

            let current_password = isUser.password;
            console.log(otpchk);
            if (old_password === undefined) {

                let otpverify = await otp.findOne({
                    loginid: isUser._id,
                    otp: otpchk
                })
                if (otpverify) {
                    const hashPassword = bcrypt.hashSync(password, saltRounds);
                    await UserLogins.findByIdAndUpdate(isUser._id, {
                        password: hashPassword
                    });
                    await otp.deleteOne({
                        loginid: isUser._id
                    }, {
                        otp: otpchk
                    });


                    return res.send({
                        status: true,
                        message: 'Password updated successfully'
                    });
                } else {
                    return res.send({
                        status: false,
                        message: 'Otp Not valid'
                    });

                }






            } else {

                const checkPassword = await bcrypt.compare(old_password, current_password);
                console.log(checkPassword);
                if (checkPassword == false) {
                    return res.send({
                        status: false,
                        message: 'Current password not matched for your old password'
                    });
                }


                const hashPassword = bcrypt.hashSync(password, saltRounds);
                await UserLogins.findByIdAndUpdate(isUser._id, {
                    password: hashPassword
                });

                return res.send({
                    status: true,
                    message: 'Password updated successfully'
                });

            }

        } catch (error) {
            return res.send({
                status: false,
                message: error.message
            });
        }

    },




    getAllUser: async(req, res, next) => {
        try{
        const { user_id } = req.body;

        if (!user_id) {
            res.send({ status: 400, message: "Required Parameter is missing" });
            return;
        }



        const UserList = await UserLogins.aggregate([
            {
                $match: {
                    _id:{$ne : mongoose.Types.ObjectId(user_id) },
                    roles : {$ne : 'ADMIN'}

                }
              },
              {
                $lookup: {
                  from: "mint_requests",
                  let: {
                    id: "$_id", //All UserLogins variables,
                  },
      
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$accept_status", true] },          
                            {$or:
                                [ { $eq: [
                                    "$$id", //localField variable it can be used only in $expr
                                    "$sender_id", //foreignField
                                  ],} ,
                                 { $eq: [
                                    "$$id", //localField variable it can be used only in $expr
                                    "$reciever_id", //foreignField
                                  ],}

                                ]
                                } ,  
                                
                                {
                          
                            },
                          ],
                        },
                      },
                    },
                  ],
                  as: "userData",
                },
              },


              {
                $project: {
                    username: 1,
                    email: 1,
                    mobile_number: 1,
                    roles: 1,
                    avatar: 1,
                    dob: 1,
                    isEmailVerified: 1,
                    firebase_token: 1,
                    username: 1,
                    'userData': {
                        $cond: {
                            if: { $eq: ["$user_status", "deactive"] },
                            then: "deactive",
                            else: "active"
                        }
                    },
                
                }
            },
      
    ]);


    res.send({ status: 200, UserList : UserList, message: `Get User List Successfully` })


}catch(error){
    res.send({status: 400, message: error.message})
    return;
}

    },


}



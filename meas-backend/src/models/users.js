const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    mobile_number: {
        type: String,
        unique: true,

    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: String
    }, // 'USER'  'ADMIN'
    otp: {
        type: String,
        default: null
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    user_status: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: null
    },
    dob: {
        type: String
    },
    firebase_token: {
        type: String,
        default: null
    },
    last_login_time: {
        type: Date,
        default: null
    }, // for login history
    no_of_loggedin: {
        type: Number,
        default: 0
    },






});

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('users', schema);
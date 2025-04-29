const { Schema, model } = require('mongoose');
const { generateToken } = require('../services/token.service')

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique : true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileimage:{
        type:String,
        default: '/uploads/user-img.jpg',
        require: false
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

}, { timestamps: true });

const User = model('User', userSchema);

module.exports = User;
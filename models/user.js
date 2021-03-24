
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String},
    email: {type: String, required: true, unique: true, match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i},
    emailToken: String,
    emailVerification: false,
    password: {type: String, required: true},
    //active: {type: Int16Array, required: true},
    phonenumber: {type: String, required: false},
    resetLink: { data: String, default: '' },
    resetPasswordExpires: Date
},{timestamp: true});

module.exports = mongoose.model('User',userSchema);

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, required: true, unique: true, match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i},
    password: {type: String, required: true},
    //active: {type: Int16Array, required: true},
    phonenumber: {type: String, required: false},
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

module.exports = mongoose.model('User',userSchema);
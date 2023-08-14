const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    
    id: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false
    }
    },{timestamps: true});

const User = mongoose.model('users', userSchema);

module.exports = User;
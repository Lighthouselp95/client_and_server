const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema ({

    personID: {
        type: String,
        required: true
    },
    groupID: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    }, 
    tag: {
        type: String,
        required: false
    },
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    like: [{
        id: String,
        name: String
    }],
    comment: {
        type: String,
        required: false
    }
    },{timestamps: true});

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
    }
    },{timestamps: true});
    

    
    
const Blog = mongoose.model('blogs', blogSchema);
const User = mongoose.model('users', userSchema);
module.exports = {Blog, User};

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema ({

    personID: {
        type: String,
        required: true
    },
    name: {
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
    file: [{
        asset_id: String,
        url: String,
        resource_type: String,
        createAt: String,
        file_format: String,
        public_id: String
    }],
    like: [{
        userId: String,
        name: String
    }],
    comments: [{
        userId: String,
        comment: String,
        name: String,
        createAt: String
    }]
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
    },
    comments: [{
        postId: String,
        comment: String,
        name: String,
        createAt: String
    }],
    like: [{postId: String}],
    token: {
        type: String,
        required: false
    }
    },{timestamps: true});
    

    
    
const Blog = mongoose.model('blogs', blogSchema);
const User = mongoose.model('users', userSchema);
module.exports = {Blog, User};

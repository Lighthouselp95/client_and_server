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
        type: String
    },
    title: {
        type: String
    }, 
    tag: {
        type: String
    },
    snippet: {
        type: String
    },
    body: {
        type: String
    },
    file: [{
        asset_id: String,
        url: String,
        resource_type: String,
        createAt: String,
        file_format: String,
        public_id: String,
        original_filename: String

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
        type: String
    }
    },{timestamps: true});
    

    
    
const Blog = mongoose.model('blogs', blogSchema);
const User = mongoose.model('users', userSchema);
module.exports = {Blog, User};

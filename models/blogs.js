const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema ({

    personID: {
        type: Number,
        required: true
    },
   
    groupID: {
        type: Number,
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
    }
    },{timestamps: true});

const Blog = mongoose.model('blogs', blogSchema);

module.exports = Blog;
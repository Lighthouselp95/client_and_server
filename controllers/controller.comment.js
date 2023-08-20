const mongoose = require('mongoose');


const {Blog, User} = require('../models/Schema');

module.exports = async (req, res, next) => {
    try {   
            const commentId = new mongoose.Types.ObjectId();
            const user = await User.findOneAndUpdate({_id: req.userId}, {$push: {"comments": {"userId": req.userId, "name": req.userName,
            "comment": req.body.comment, _id: commentId}}},{returnOriginal: false});
            const blog = await Blog.findOneAndUpdate({_id: req.params.postId}, {$push: {"comments": {"userId": req.userId, "name": req.userName,
            "comment": req.body.comment, _id: commentId}}},{returnOriginal: false}); //use "" inside projection
            console.log('user', user);
            console.log('blog', blog);
            return res.status(200).send({status: 'commented', comment: req.body.comment, name: req.userName, _id: commentId, userId: req.userId});
        
    } 
    catch (err) {console.log(err)};
}
const mongoose = require('mongoose');


const {Blog, User} = require('../models/Schema');

module.exports = async (req, res, next) => {
    try {   
        console.log('req.body: ', req.body)
            const commentId = new mongoose.Types.ObjectId();
            const user = await User.findOneAndUpdate({_id:  req.cookies.uid}, {$push: {"comments": {"postId": req.params.postId, "name": req.userName,
            "comment": req.body.comment, _id: commentId, createAt: new Date()}}},{returnOriginal: false});
            const blog = await Blog.findOneAndUpdate({_id: req.params.postId}, {$push: {"comments": {"userId":  req.cookies.uid, "name": req.userName,
            "comment": req.body.comment, _id: commentId, createAt: new Date()}}},{returnOriginal: false}); //use "" inside projection
            // console.log('user', user);
            console.log('blog', blog.comments);

            // console.log(new Date())
            // console.log('e', blog.comments[0]._id.toString());
            const comments = blog.comments.find((e) => e._id.toString()==commentId);
            // console.log(comments);
            comments.status = 'commented'
            return res.status(200).send(comments);
            // return res.status(200).send({status: 'commented', comment: req.body.comment, name: req.userName, _id: commentId, userId: req.userId});

        
    } 
    catch (err) {console.log(err)};
}
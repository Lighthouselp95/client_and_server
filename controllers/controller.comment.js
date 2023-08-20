const {Blog, User} = require('../models/Schema');

module.exports = async (req, res, next) => {
    try {
            const user = await User.findOneAndUpdate({_id: req.userId}, {$push: {"comments": {"postId": req.params.postid, 
            "comment": req.body.comment}}},{returnOriginal: false});
            const blog = await Blog.findOneAndUpdate({_id: req.params.postId}, {$push: {"comments": {"userId": req.userId, "name": req.userName,
            "comment": req.body.comment}}},{returnOriginal: false}).exec(); //use "" inside projection
            // console.log('user', user);
            console.log('blog', blog);
            return res.status(200).send({status: 'commented', comment: req.body.comment, name: req.userName});
        
    } 
    catch (err) {console.log(err)};
}
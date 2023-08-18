const {Blog, User} = require('../models/Schema');

module.exports = async (req, res, next) => {
    try {
        // console.log(await User.findOne({_id: req.userId}));
        // const oldUser2 = await User.findOne({_id: req.userId,"like.postId": req.params.postid});
        const oldUser = await User.findOne({_id: req.userId,like: {$elemMatch: {postId: req.params.postid}}}); //same ket qua
        // console.log('olduser', oldUser);
        // console.log('olduser2', oldUser2);
        if(!oldUser) {
            const user = await User.findOneAndUpdate({_id: req.userId}, {$push: {"like": {"postId": req.params.postid}}},
            {returnOriginal: false});
            const blog = await Blog.findOneAndUpdate({_id: req.params.postid}, {$push: {"like": {"userId": req.userId, "name": req.userName}}},
            {returnOriginal: false}).exec(); //use "" inside projection
            // console.log('user', user);
            // console.log('blog', blog);
            return res.status(200).send(['liked', user, blog]);
        }
        else {
            const user = await User.findOneAndUpdate({_id: req.userId},{$pull: {"like": {"postId": req.params.postid}}},
            {returnOriginal: false});
            const blog = await Blog.findOneAndUpdate({_id: req.params.postid},{$pull: {"like": {"userId": req.userId, "name": req.userName}}},
            {returnOriginal: false});
            return res.status(200).send(['you liked it', user, blog]);
        }
    } 
    catch (err) {console.log(err)};
}
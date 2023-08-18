const {Blog, User} = require('../models/Schema');

module.exports = async (req, res, next) => {
    try {
        console.log(await User.findOne({_id: req.userId}));
        const oldUser2 = await User.findOne({_id: req.userId,"like.postId": req.params.postid});
        const oldUser = await User.findOne({_id: req.userId,like: {$elemMatch: {postId: req.params.postid}}}); //same ket qua
        // console.log('olduser', oldUser);
        // console.log('olduser2', oldUser2);
        if(!oldUser2) {
            const user = await User.findOneAndUpdate({_id: req.userId}, {$push: {"like": {"postId": req.params.postid}}});
            const blog = await Blog.findOneAndUpdate({_id: req.params.postid}, {$push: {"like": {"userId": req.userId, "name": req.userName}}}).exec(); //use "" inside projection
            // console.log('user', user);
            // console.log('blog', blog);
            return res.status(200).send('liked');
        }
        else {
            await User.findOneAndUpdate({_id: req.userId},{$pull: {"like": {"postId": req.params.postid}}});
            await Blog.findOneAndUpdate({_id: req.params.postid},{$pull: {"like": {"userId": req.userId, "name": req.userName}}});
            return res.status(200).send('you liked it');
        }
    } 
    catch (err) {console.log(err)};
}
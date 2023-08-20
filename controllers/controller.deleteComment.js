const {Blog, User} = require('../models/Schema');


module.exports = async (req, res, next) => {
    if(req.userId == req.body.cmId) {
        try {
            const user = await User.findOneAndUpdate({_id: req.userId},{$pull: {"comments": {"postId": req.params.postid}}},
                        {returnOriginal: false});
            const blog = await Blog.findOneAndUpdate({"comments": {$elemMatch:{_id: req.params.cmtId}}}, {$pull: {"comments": {"_id": req.params.cmtId}}},
            {returnOriginal: false});
            console.log(user, blog);
            return res.status(200).send('comment deleted');
        }
        catch(err) {
            console.log(err);
        }
    }
    else {
        return res.status(401).send('Unauthorized delete comment')
    }
}
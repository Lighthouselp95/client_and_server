const {Blog, User} = require('../models/Schema');

module.exports = async (req, res, next) => {
    try {

        var oldUser = await User.findById(req.userId).exec();

        const blog = new Blog({
            personID: req.userId,
            groupID: 9876553431,
            title: req.body.title,
            snippet: 'Fb',
            body: req.body.body
        });

        var recentBlog;
        await blog.save()
                    .then(async (result) => {
                        recentBlog = await Blog.findById(result._id).lean()
                        recentBlog.name = oldUser.name;
                        return res.send(recentBlog);
                    })
                    .catch((err) => (console.log(err)));
                }
            
            catch (err) {console.log(err)}
}
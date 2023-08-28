const {Blog, User} = require('../models/Schema');

module.exports = async (req, res, next) => {
    try {

        // var oldUser = await User.findById(req.userId).exec();

        const blog = new Blog({
            personID: req.userId,
            name: req.userName,
            groupID: 9876553431,
            title: req.body.title,
            snippet: 'Fb',
            body: req.body.body,
            file: {asset_id: req.file.asset_id, url: req.file.url, file_type: req.file.resource_type, createAt: req.file.created_at, file_format: req.file.format}
        });

        var recentBlog;
        await blog.save()
                    .then(async (result) => {
                        recentBlog = await Blog.findById(result._id)
                        return res.send(recentBlog);
                    })
                    .catch((err) => (console.log(err)));
                }
            
            catch (err) {console.log(err)}
}
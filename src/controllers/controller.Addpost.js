const {Blog, User} = require('../models/Schema');

module.exports = async (req, res, next) => {
    try {
        console.log(req.body, '//', req.file)
        // var oldUser = await User.findById(req.userId).exec();
            req.body.personID = req.userId;
            req.body.name = req.userName;
        const blog = new Blog(
            req.body
            // {
            // personID: req.userId,
            // name: req.userName,
            // groupID: 9876553431,
            // title: req.body.title&&req.body.title,
            // snippet: 'Fb',
            // body: req.body.body&&req.body.body,
            // file: req.file?{asset_id: req.file.asset_id, url: req.file.secure_url, resource_type: req.file.resource_type, createAt: req.file.created_at, file_format: req.file.format}:[]
        // }
        );
        blog.file = [];
        if(req.files) {
        req.files.forEach((e) => {
            blog.file.push(e)
        })
    }
        console.log(blog);
        var recentBlog;
        await blog.save()
                    .then(async (result) => {
                        recentBlog = await Blog.findById(result._id)
                        return res.status(201).send(recentBlog);
                    })
                    .catch((err) => (console.log(err)));
                }
            
            catch (err) {console.log(err)}
}
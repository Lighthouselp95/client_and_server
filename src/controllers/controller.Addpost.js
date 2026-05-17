const {Blog, User} = require('../models/Schema');

module.exports = async (req, res, next) => {
    try {
        console.log(req.body, '//', req.file)
        // var oldUser = await User.findById(req.userId).exec();
            req.body.personID = req.userId;
            req.body.name = req.userName;
        
            function embedYouTubeLinks(text) {
              // Regex captures standard, share, and shorts YouTube URLs
              // const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})[^\s]*/gi;
              const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[^\s]*)/gi;
              
              // Replace the link with an iframe embed
              return text.replace(ytRegex, (match, videoId) => {
                // return `<iframe width=100% height="400" src="https://youtube.com{videoId}" frameborder="0" allowfullscreen></iframe>`;
                return `<iframe width="100%" height="400" src="https://youtube.com${videoId}" frameborder="0" allowfullscreen></iframe>`;
              });
                }
            req.body.body=req.body.body + embedYouTubeLinks(req.body.body);
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
        // var recentBlog;
        // await blog.save()
        //             .then(async (result) => {
        //                 recentBlog = await Blog.findById(result._id).lean();
        //                 let recentUser = await User.findById(req.userId).lean();
        //                 return res.status(201).send({...recentBlog, user: [recentUser]});
        //             })
        //             .catch((err) => (console.log(err)));

        // 1. Await the save operation directly without .then()/.catch()
        const result = await blog.save();
        
        // 2. Fetch related data using lean() for better performance
        const recentBlog = await Blog.findById(result._id).lean();
        const recentUser = await User.findById(req.userId).lean();
        
        // 3. Return the response and exit the function immediately
        return res.status(201).send({ ...recentBlog, user: [recentUser] });
                }
            
            catch (err) {console.log(err)}
}

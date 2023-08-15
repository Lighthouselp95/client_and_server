const jwt = require('jsonwebtoken');
const Blog = require('../models/blogs');
const User = require('../models/users');

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-acess-token'];
    console.log('req token: ', token);
    if (!token) {
        return res.status(403).send("A access token is needed");
    };
    try {
    jwt.verify( token, process.env.TOKEN_KEY, async (err, decoded) => {
        if(err) {
            console.log(err);
            return res.status(401).send({error:"Unauthorized!"})
        }
        req.Userid = decoded.id;
        try {
        var oldUser = await User.findOne({id: decoded.id});
        }
        catch (err) {
            console.log('finuser error: ', err);
        }
        // console.log('User finded: ', oldUser);
        // console.log('decoded: ', decoded);
        const blog = new Blog({
            personID: req.Userid,
            groupID: 9876553431,
            title: req.body.title,
            snippet: 'Fb',
            body: req.body.body
        });
        console.log()
        // blog.save()
        //     .then((result) => {
        //         // console.log(result.lean());
        //         // Object.assign(result,{dang: 'nguyen'});
        //         result = JSON.stringify(result);
        //         result = JSON.parse(result);
        //         result.name = oldUser.name;
        //         console.log(result);
        //         return res.send(result);
        //     })
        //     .catch((err) => (console.log(err)));
        var recentBlog;
        await blog.save()
                    .then(async (result) => {
                        recentBlog = await Blog.findById(result._id).lean()
                        console.log(recentBlog);
                        recentBlog.name = oldUser.name;
                        return res.send(recentBlog);
                    })
                    .catch((err) => (console.log(err)));
       
            })
       
    }
    catch(err) {
        return res.status(409).send('Wrong token: ', err);
        console.log(err);
    }

};

module.exports = verifyToken;
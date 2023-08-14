const jwt = require('jsonwebtoken');
const Blog = require('../models/blogs');


const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-acess-token'];
    console.log('req token: ', token);
    if (!token) {
        return res.status(403).send("A access token is needed");
    };
    // try {
    jwt.verify( token, process.env.TOKEN_KEY, (err, decoded) => {
        if(err) {
            return res.status(401).send({message: "Unauthorized!"})
        }
        req.Userid = decoded.id;
        console.log('decoded: ', decoded);
        const blog = new Blog({
            personID: req.Userid,
            groupID: 9876553431,
            title: req.body.title,
            snippet: 'Fb',
            body: req.body.body
        });
        blog.save()
            .then((result) => {
                return res.send(result);
            })
            .catch((err) => (console.log(err)));
    }
    );
       
    // }
    // catch(err) {
    //     return res.status(409).send('Wrong token: ', err);
    //     console.log(err);
    // }

};

module.exports = verifyToken;
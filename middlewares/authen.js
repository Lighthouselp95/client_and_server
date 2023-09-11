const jwt = require('jsonwebtoken');
const {Blog, User} = require('../models/Schema');

const verifyToken = async (req, res, next) => {
    console.log(' --- ', req.body)
    console.log(' req.headers:  ', req.headers['user-agent'])
    const token = req.cookies.token || req.headers['x-acess-token'];

    if (!token) {
        console.log("Err: Acess token is needed");

        return res.status(403).send("A access token is needed");
    };
    try {
        jwt.verify( token, process.env.TOKEN_KEY, (err, decoded) => {
            if(err) {
                res.clearCookie("token");
                User.findByIdAndUpdate(req.cookies.uid, {$unset: {token: 1}})
                    .then(result => console.log('finded: ',result.length))
                    .catch( err => console.log(err));
                return res.status(401).send({error:"Unauthorized!"})
                }
            req.userId = decoded.userId; //export userid
            req.userName = decoded.name;
            // console.log(decoded, req.userName, req.userId);
            User.findOne({_id: req.cookies.uid, token: req.cookies.token})
                .then(result => console.log('Account logined'))
                .catch(err => {
                    return res.status(401).send({error:"Unauthorized!"})
                    }
                    );
            next();
            });
        
        }
    catch(err) {
        // console.log(err);
        // res.cookie(`aut`, 0, {
        //     maxAge: 432000000,
        //     // expires works the same as the maxAge
        //     // expires: new Date('01 12 2021'),
        //     // secure: true,
        //     sameSite: 'lax'
        // });
        return res.status(409).send('Wrong token: ', err);
        
    }
    
};

module.exports = verifyToken;
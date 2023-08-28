const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    console.log(' --- ', req.body)
    const token = req.body.token || req.query.token || req.headers['x-acess-token'];

    if (!token) {
        console.log("Err: Acess token is needed");
        return res.status(403).send("A access token is needed");
    };
    try {
        jwt.verify( token, process.env.TOKEN_KEY, async (err, decoded) => {
            if(err) {
                console.log(err);
                console.log("Err: Unauthorized")
                return res.status(401).send({error:"Unauthorized!"})
            }
            req.userId = decoded.userId; //export userid
            req.userName = decoded.name;
            // console.log(decoded, req.userName, req.userId);
            
        next();
        });
        
    }
    catch(err) {
        console.log(err);
        return res.status(409).send('Wrong token: ', err);
        
    }
    
};

module.exports = verifyToken;
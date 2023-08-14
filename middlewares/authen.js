const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-acess-token'];
    console.log('req token: ', token);
    if (!token) {
        return res.status(403).send("A access token is needed");
    }
    // try {
    jwt.verify(token, process.env.TOKEN_KEY),(err, decoded) => {
        if(err) {
            return res.status(401).send({message: "Unauthorized!"})
        }
        req.Userid = decoded;
        console.log('decoded: ', decoded);
    };
    next();
    // }
    // catch(err) {
    //     return res.status(409).send('Wrong token: ', err);
    //     console.log(err);
    // }
}

module.exports = verifyToken;
const bcrypt = require('bcryptjs');
const {Blog, User} = require('../models/Schema');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
        try {
            const {id, password} = req.body;
    
            if(!(id && password)) {
                console.log("All input is required")
                res.status(400).send("All input is required");
                return;
                }
            else {
                const oldUser = await User.findOne({id: id})
                if(oldUser) {
                    const name = oldUser.name;
                    const isPasswordValid = bcrypt.compareSync(password, oldUser.password);
                    console.log('isPasswordValid: ', isPasswordValid);
                    if(!isPasswordValid) {
                        res.status(409).send("wrong password");
                    } 
                    else {
                    console.log('sucess! ', oldUser);
                    
                    const token = jwt.sign(
                        {userId: oldUser._id, password: password, name: name},
                        process.env.TOKEN_KEY,
                        {
                            allowInsecureKeySizes: true,
                            expiresIn: "1d"
                        });
                        console.log('login token: ', token);
                        req.token = token;
                        // res.send()
                        // res.writeHead(200, {'Refresh' : '1'});
                        res.status(200).send(['sucess', token, oldUser._id, name]);
                        return;
                        }
                    }  
                else {
                    res.status(409).send("Account have not been registed yet");
                    return;
                }       
                }
            }
        catch (err) {
            console.log('err: ', err);        
        };
        console.log('come to next middleware');
}
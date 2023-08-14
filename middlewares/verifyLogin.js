const bcrypt = require('bcryptjs');
const User = require('../models/users');
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
                console.log('oldUser: ', oldUser);
                if(oldUser) {
                    const isPasswordValid = bcrypt.compareSync(password, oldUser.password);
                    console.log('isPasswordValid: ', isPasswordValid);
                    if(!isPasswordValid) {
                        res.status(409).send("wrong password");
                    } 
                    else {
                    console.log('sucess! ', oldUser);
                    const token = jwt.sign(
                        {id: id, password: password},
                        process.env.TOKEN_KEY,
                        {
                            allowInsecureKeySizes: true,
                            expiresIn: "1h"
                        });
                        console.log('login token: ', token);
                        req.token = token;
                        // res.send()
                        // res.writeHead(200, {'Refresh' : '1'});
                        res.status(200).send(['sucess', token, id]);
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
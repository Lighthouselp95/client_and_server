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
                    // console.log('sucess! ', oldUser);
                    
                    const token = jwt.sign(
                        {userId: oldUser._id, password: password, name: name},
                        process.env.TOKEN_KEY,
                        {
                            allowInsecureKeySizes: true,
                            expiresIn: "10s"
                        });
                        console.log('login token: ', token);
                        req.token = token;
                        // res.send()
                        // res.writeHead(200, {'Refresh' : '1'});
                        const newtokenuser = await User.findOneAndUpdate({id: id}, {"token": token});
                        console.log(newtokenuser.token);
                        res.cookie(`token`, token, {
                            maxAge: 432000000,
                            // expires works the same as the maxAge
                            // expires: new Date('01 12 2021'),
                            // secure: true,
                            sameSite: 'lax'
                        });
                        res.cookie(`uid`, oldUser._id.valueOf(), {
                            maxAge: 432000000,
                            // expires works the same as the maxAge
                            // expires: new Date('01 12 2021'),
                            // secure: true,
                            sameSite: 'lax'
                        });

                        res.status(200).send({status:'Login sucess', userId : oldUser._id, name: name});
                        return;
                        }
                    }  
                else {
                    return res.status(409).send("Account have not been registed yet");
                    
                }       
                }
            }
        catch (err) {
            console.log('err: ', err);        
        };
}
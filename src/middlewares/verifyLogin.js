const bcrypt = require('bcryptjs');
const {Blog, User} = require('../models/Schema');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    console.log(req.body);
    console.log(req.cookies.token)
    if(!req.cookies.token&&req.body) {
        try {
            const {id, password}=  req.body;

            const oldUser = await User.findOne({id: id}).lean();
            if(oldUser) {
                const name = oldUser.name;
                const isPasswordValid = oldUser?.password&&bcrypt.compareSync(password, oldUser.password);
                console.log('isPasswordValid: ', isPasswordValid);
                if(!isPasswordValid) {
                    res.status(409).send("wrong password");
                } 
                else {
                // console.log('sucess! ', oldUser);
                
                const token = jwt.sign(
                    {userId: oldUser._id, name: name},
                    process.env.TOKEN_KEY,
                    {
                        allowInsecureKeySizes: true,
                        expiresIn: "5d"
                    });
                    console.log('login token: ', token);
                    req.token = token;
                    // res.send()
                    // res.writeHead(200, {'Refresh' : '1'});
                    const newtokenuser = await User.findOneAndUpdate({id: id}, {"token": token});
                    console.log(newtokenuser.token);
                    res.cookie(`token`, token, {
                        maxAge: 432000000,
                        sameSite: 'lax'
                    });
                    res.cookie(`uid`, oldUser._id.valueOf(), {
                        maxAge: 432000000,
                        sameSite: 'lax'
                    });
                    res.cookie('name', oldUser.name, {
                        maxAge: 432000000,
                        sameSite: 'lax'
                    })
                    delete oldUser.password;

                    res.status(200).json({status:'Login sucess', userId : oldUser._id, name: name, user: oldUser});
                    return;
                    }
            }  
            else {
                return res.status(409).send("Account have not been registed yet");
                
            }       
             }
            
        catch (err) {
            console.log('err: ', err);    
            return res.status(409).send("Account have not been registed yet");    
        };
    }
    else if (req.cookies.token) {
        try {
            const token = req.cookies.token;

            jwt.verify( token, process.env.TOKEN_KEY, (err, decoded) => {
                if(err) {
                    res.clearCookie("token");
                    res.clearCookie("uid");
                    User.findByIdAndUpdate(req.cookies.uid, {$unset: {token: 1}})
                        .then(result => console.log('finded: ',result.length))
                        .catch( err => console.log(err));
                    return res.status(401).send({error:"Unauthorized!"})
                    }
                User.findOne({_id: req.cookies.uid, token: req.cookies.token}).lean()
                    .then(oldUser => {console.log('Account logined');
                        delete oldUser.password;

                        res.status(200).json({status:'Login sucess', userId : oldUser._id, name: oldUser.name, user: oldUser});
                        })
                    .catch(err => {
                        console.log(err)
                        res.clearCookie("token");
                        res.clearCookie("uid");
                        return res.status(401).send({error:"Unauthorized!"})
                        }
                        );
                });
    
        } catch (error) {
            return res.status(401).send({error: error});
        }
    }
    else {
            console.log("All input is required")
            res.status(400).send("All input is required");
            return;
    }
}
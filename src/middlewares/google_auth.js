const {Blog, User} = require('../models/Schema');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');

module.exports = async (req, res, next) => {
    console.log(req.body);
    console.log(req.params, '--', req.query);
    const client = new OAuth2Client();
    const token = req.body.credential;
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // console.log(ticket, payload, userid);
        // return payload;
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        if(payload) {
            console.log(payload);
            var oldUser = await User.findOne({email: {$regex: payload.email, $options: 'i'}}); //
            
            console.log(oldUser);
            if(!oldUser) {
                const newUser = new User (
                    payload
                )
                console.log(newUser)
                await newUser.save().then(r => {console.log(r);
                    oldUser = newUser;
                    });
            }
                const token = jwt.sign(
                {userId: oldUser._id, name: oldUser.name},
                process.env.TOKEN_KEY,
                {
                    allowInsecureKeySizes: true,
                    expiresIn: "5d"
                });
                const newtokenuser = await User.findOneAndUpdate({email: {$regex: payload.email, $options: 'i'}}, {"token": token});
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
                return res.redirect('/');
                
                
                    
                
            
        } else {
        }
    }
    verify().catch(err => console.log(err));
    
}
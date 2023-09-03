const bcrypt = require('bcryptjs');
const {Blog, User} = require('../models/Schema');
const jwt = require('jsonwebtoken');


module.exports = async (req, res, next) => {
    try {
            const {id, password, email, name} = req.body;
            encryptedPassword = bcrypt.hashSync(password, 10);
            console.log('encryptedpw: ', encryptedPassword);
            
            const user = new User({
                id: id,
                password: encryptedPassword,
                email: email,
                name: name
            });
            user.save()
                .then((result) => {
                    console.log('signup inf: ',result);
                    // res.send()
                    // res.writeHead(200, {'Refresh' : '1'});
                    const token = jwt.sign(
                        {userId: user._id, password: password, name: name},
                        process.env.TOKEN_KEY,
                        {
                            allowInsecureKeySizes: true,
                            expiresIn: "3d"
                        });
                        console.log('signup token: ', token);
                        req.token = token;
                        res.cookie(`token`, token, {
                            maxAge: 432000000,
                            // expires works the same as the maxAge
                            // expires: new Date('01 12 2021'),
                            // secure: true,
                            httpOnly: true,
                            sameSite: 'lax'
                        });
                     res.status(200).send(['sucess', token, user._id, name]);
                     return;
                    // res.redirect(req.get('referer'));
                })
                .catch((err) => (console.log(err)))
        }
    catch (err) {
        console.log(err);
        return;
        }
    }
            

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
                        {id: user._id, password: password},
                        process.env.TOKEN_KEY,
                        {
                            allowInsecureKeySizes: true,
                            expiresIn: "1h"
                        });
                        console.log('signup token: ', token);
                        req.token = token;
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
            

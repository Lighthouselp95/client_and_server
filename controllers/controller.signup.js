const bcrypt = require('bcryptjs');
const User = require('../models/users');
const jwt = require('jsonwebtoken');


module.exports = async (req, res, next) => {
    try {
            const {id, password, email} = req.body;
            encryptedPassword = bcrypt.hashSync(password, 10);
            console.log('encryptedpw: ', encryptedPassword);
            const token = jwt.sign(
                {id: id, password: password},
                process.env.TOKEN_KEY,
                {
                    allowInsecureKeySizes: true,
                    expiresIn: "1h"
                });
                console.log('signup token: ', token);
                req.token = token;
            const user = new User({
                id: id,
                password: encryptedPassword,
                email: email,
                token: token
            });
            user.save()
                .then((result) => {
                    console.log('signup inf: ',result);
                    // res.send()
                    // res.writeHead(200, {'Refresh' : '1'});
                     res.status(200).send(['sucess', token, id]);
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
            

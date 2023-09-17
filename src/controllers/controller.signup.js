const bcrypt = require('bcryptjs');
const {Blog, User} = require('../models/Schema');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = async (req, res, next) => {
    try {
            const {id, password, email, name} = req.body;
            encryptedPassword = bcrypt.hashSync(password, 10);
            console.log('encryptedpw: ', encryptedPassword);
            const _id = new mongoose.Types.ObjectId();
            const token = jwt.sign(
                {userId: _id.valueOf(), password: password, name: name},
                process.env.TOKEN_KEY,
                {
                    allowInsecureKeySizes: true,
                    expiresIn: "50d"
                });
                console.log('signup token: ', token);
                req.token = token;
                
                
                // res.cookie(`aut`, 1, {
                //     maxAge: 432000000,
                //     // expires works the same as the maxAge
                //     // expires: new Date('01 12 2021'),
                //     // secure: true,
                //     sameSite: 'lax'
                // });
            const user = new User({
                _id: _id,
                id: id,
                password: encryptedPassword,
                email: email,
                name: name,
                token: token
            });
            user.save()
                .then((result) => {
                    console.log('signup inf: ',result);
                    res.cookie(`uid`, _id.valueOf(), {
                        maxAge: 432000000,
                        sameSite: 'lax'
                    });
                    res.cookie(`token`, token, {
                        maxAge: 4320000000,
                        sameSite: 'lax'
                    });
                     return res.status(200).send({status:'sucess', userId : user._id, name: name});
                    // res.redirect(req.get('referer'));
                })
                .catch((err) => {console.log(err);
                    return res.status(404).send(err) })
        }
    catch (err) {
        console.log(err);
        return res.status(404).send(err);
        }
    }
            

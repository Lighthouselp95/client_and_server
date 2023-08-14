const bcrypt = require('bcryptjs');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

module.exports.verify = async (req, res, next) => {
    try {
        const {id, password, email} = req.body;

        if(!(id && password && email)) {
            console.log("All input is required")
            res.status(400).send("All input is required");
            return;
            }
        else {
            const oldUser = await User.findOne({email});
            console.log('signup oldUser: ', oldUser);
            if (oldUser) {
                console.log("User is already registed");
                return res.status(409).send("User is already registed");
                
                        }
           
            }
        }
    catch (err) {
        console.log(err);        
    };
    console.log('come to next middleware');
    next();
}
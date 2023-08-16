const bcrypt = require('bcryptjs');
const {Blog, User} = require('../models/Schema');
const jwt = require('jsonwebtoken');

module.exports.verify = async (req, res, next) => {
    try {
        const {id, password, email, name} = req.body;

        if(!(id && password && email)) {
            console.log("All input is required")
            res.status(400).send("All input is required");
            return;
            }
        else {
            const oldUser = await User.findOne({email});
            if (oldUser) {
                return res.status(409).send("Email is already registed");
                }
            }
                    
            const oldUser2 = await User.findOne({id});
            console.log('signup oldUser: ', oldUser2);
            if (oldUser2) {
                return res.status(409).send("User is already registed");
                
                    }
                
            }
        
    catch (err) {
        console.log(err);        
    };
    console.log('come to next middleware');
    next();
}
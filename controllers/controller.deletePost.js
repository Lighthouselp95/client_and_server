const bcrypt = require('bcryptjs');
const {Blog, User} = require('../models/Schema');
const jwt = require('jsonwebtoken');


module.exports = async (req, res, next) => {
    try {

    const blog = await Blog.findById(req.params.id).exec();
    
    if ( blog.personID == req.userId) {
        console.log('dung');
        
        
        await Blog.findByIdAndRemove(`${req.params.id}`);
        return res.status(200).send('deleted');
    } else {
        console.log('sai');
        return res.status(401).send('Unauthorized');
        
    }
} catch (err) {
    console.log(err);
    return res.status(404).send(err);

};
}
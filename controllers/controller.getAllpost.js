const {Blog, User} = require('../models/Schema');



module.exports = async (req, res, next) => {
    try {
        let blogs = await Blog.find().exec();
        blogs = JSON.stringify(blogs);
        blogs = JSON.parse(blogs);
        // console.log(blogs);
        for (let ele of blogs) {   
            // console.log(typeof ele.personID);
            const oldUser = await User.findById(ele.personID).exec();
            // console.log(oldUser.name);
            ele.name = oldUser.name;
            }
        // console.log(blogs);
        res.send(blogs);
        } 
    catch(err) {
        console.log(err);
        };
    }
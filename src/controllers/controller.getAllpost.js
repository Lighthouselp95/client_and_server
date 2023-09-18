const {Blog, User} = require('../models/Schema');



module.exports = async (req, res, next) => {
    try {
        console.log('da vao')
        let blogs = await Blog.find().sort({createdAt: 1}).exec();
        // blogs = JSON.stringify(blogs);
        // blogs = JSON.parse(blogs);
        // console.log(blogs);
        // for (let ele of blogs) {   
        //     // console.log(typeof ele.personID);
        //     const oldUser = await User.findById(ele.personID).exec();
        //     // console.log(oldUser.name);
        //     ele.name = oldUser.name;
        //     }
        // console.log(blogs[38].file);
        res.send(blogs);
        } 
    catch(err) {
        console.log(err);
        };
    }
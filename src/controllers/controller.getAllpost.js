const { Blog, User } = require("../models/Schema");

module.exports = async (req, res, next) => {
   try {
      console.log("da vao");
    //   let blogs = await Blog.find().sort({ createdAt: 1 }).exec();
      // let user = await User.find()
     let blogs = await Blog.aggregate([
         {
            $addFields: {
               personID2: { $convert: { input: "$personID", to: "objectId" } },
            },
         },
         {
            $lookup: {
               from: "users",
               localField: "personID2",
               foreignField: "_id",
               as: "user",
            },
         },
         
         {
            $project: {
               "user.like": 0,
               "user.comments": 0,
               token: 0,
               password: 0,
            },
         },
         {$sort: {createdAt: 1}}
      ]).exec();
      // console.log(blogs)
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
   } catch (err) {
      console.log(err);
   }
};

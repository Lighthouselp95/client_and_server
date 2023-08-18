const {Blog, User} = require('../models/Schema');

module.exports = async (req, res, next) => {
    try {
        let userLike = await User.findOne({_id: req.userId}).lean();
        console.log(userLike);
        return res.status(200).send(userLike.like);
    }
    catch (err) {console.log(err)};
}
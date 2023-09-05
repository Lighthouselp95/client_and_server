const cloudinary = require('cloudinary').v2;
const {Blog, User} = require('../models/Schema');


module.exports = async (req, res, next) => {
    try {

    const blog = await Blog.findById(req.params.uid).exec();
    
    if ( blog.personID == req.userId|| req.userId == '64e0eee99c007c207682e49a') {
        console.log('dung');
        
        if(blog?.file.length!==0) {
            for(let e of blog.file) {
                console.log(!e.public_id, '--', e.url);
                console.log(e.url.split('/').slice(-1));
                if(!e.public_id) {
                    e.public_id = e.url.split('/').slice(-1)[0];
                    console.log(e.public_id);
                    await cloudinary.uploader.destroy(e.public_id);
                    console.log('deleted on cloudinary');
                }
                else {
                    await cloudinary.uploader.destroy(e.public_id);
                    console.log('deleted on cloudinary');
                }
                
            }
        }
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
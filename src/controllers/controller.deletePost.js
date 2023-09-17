
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const {Blog, User} = require('../models/Schema');


module.exports = async (req, res, next) => {
    try {

    const blog = await Blog.findById(req.params.id).exec();
    console.log(blog);
    if ( blog?.personID == req.userId|| req.userId == '64e0eee99c007c207682e49a') {
        console.log('dung');
        
        if(blog.file&&blog.file.length!==0) {
            for(let e of blog.file) {
                console.log(!e.public_id, '--', e.url);
                // if(!e.public_id) {
                //     e.public_id = e.url.split('/').slice(-1)[0];
                    console.log(e.public_id, typeof e.public_id);
                //     cloudinary.uploader.destroy(e.public_id)
                //         .then(result => {
                //             console.log(result);
                //         })
                //         .catch(err => {
                //             console.log(err);
                //             return res.status(403).send(err)
                //         });
                //     console.log('deleted on cloudinary');
                // }
                // else {
                    // e.public_id = e.public_id.split('/')[1];
                    console.log(e.public_id)
                let result = await cloudinary.uploader.destroy(e.public_id, {resource_type: e.resource_type, type: 'upload'});
                console.log(result.result);
                // if(result.result=='not found') {return res.status(403).send(result)};
                    // .then((result, error) => 
                    //     {
                    //         console.log(result.result);
                    //         if(result.result=='not found') {return res.status(403).send(result)};
                            
                    //     }
                    //     )
                console.log('deleted on cloudinary');
                // }
                
            }
                // result = await Blog.findByIdAndRemove(`${req.params.id}`).exec();
                // console.log(result);
                // return res.status(200).send('deleted');
        }
        //  else {
                await Blog.findByIdAndRemove(`${req.params.id}`).exec();
                return res.status(200).send('deleted');
        // }
    } else 
        {
            console.log('sai');
            return res.status(401).send('Unauthorized');
        
        }
} catch (err) {
    console.log(err);
    return res.status(403).send(err);

};
}
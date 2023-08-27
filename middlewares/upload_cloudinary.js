
const cloudinary = require("./cloudinary");
const uploader = require("./multer");

module.exports = async (req, res, next) => {
    try {
    const upload = await cloudinary.uploader.upload(req.file.path);
    req.file = upload;
    console.log(req.file);
    // return res.json({
    //   success: true,
    //   file: upload.secure_url,
    // });
    } 
    catch (err) {res.send(err);}
    next();
  };
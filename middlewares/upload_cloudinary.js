
const cloudinary = require("./cloudinary");
const uploader = require("./multer");

module.exports = async (req, res, next) => {
    try {
      console.group(req.file);
    const upload = await cloudinary.uploader.upload(req.file.path,{resource_type: "raw"}); //video, image or k co
    req.file = upload;
    console.log(req.file);
    // return res.json({
    //   success: true,
    //   file: upload.secure_url,
    // });
    } 
    catch (err) {res.send(err);
    console.log(err)}
    next();
  };
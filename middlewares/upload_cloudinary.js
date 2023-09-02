
const cloudinary = require("./cloudinary");
const uploader = require("./multer");

module.exports = async (req, res, next) => {
  if (req.file) {
    try {
      console.log("Req file: ", req.file);
      const upload = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"}); //video, image or k co
      req.file = [];
      req.file.push(upload);
      console.log("Upload is: ", req.file);
      // return res.json({
      //   success: true,
      //   file: upload.secure_url,
      // });
    } 
    catch (err) {
      res.send(err);
      console.log(err)
    }
  }
    next();
  };
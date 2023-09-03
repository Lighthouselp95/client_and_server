
const cloudinary = require("./cloudinary");
const uploader = require("./multer");

module.exports = async (req, res, next) => {
  if (req.files) {
    try {
      console.log(req.body, '---', req.files, '--', req.file)
      const uploads = [];
      for(let e of req.files) {
        console.log("Req file: ", e);
        let temp = await cloudinary.uploader.upload(e.path, {resource_type: "auto", folder: "client_and_server_proj"})
        uploads.push(temp); //video, image or k co
        
        // req.file.push(upload);
        console.log("Upload is: ", req.file);
        // return res.json({
        //   success: true,
        //   file: upload.secure_url,
        // });}
        }
      req.files = uploads;
      console.log(req.files);
    } 
  
    catch (err) {
      res.send(err);
      console.log(err)
    }
  }
    next();
  };

const cloudinary = require("./cloudinary");
const uploader = require("./multer");

module.exports = async (req, res, next) => {
  if (req.files) {
    try {
      console.log(req.body, '---', req.files, '--', req.file)
      const uploads = [];
      for(let e of req.files) {
        console.log("Req file: ", e);
        let temp = await cloudinary.uploader.upload(e.path, {resource_type: "auto", folder: "client_and_server_proj", use_filename: true, unique_filename: true, eager: [{ effect: "volume:30dB" }], // Boosts volume by 50% (Use "volume:auto" for normalization)
  eager_async: true})
        const finalUrl = (temp.eager && temp.eager.length > 0) ? temp.eager[0].secure_url : temp.secure_url;
uploads.push({ ...temp, finalUrl });
       // uploads.push(temp); //video, image or k co
        
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

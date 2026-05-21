
const cloudinary = require("./cloudinary");
const uploader = require("./multer");

module.exports = async (req, res, next) => {
  if (req.files) {
    try {
      console.log(req.body, '---', req.files, '--', req.file)
      const uploads = [];
      for(let e of req.files) {
        console.log("Req file: ", e);
        const isVideo = e.mimetype && e.mimetype.startsWith('video/');
        
        //let temp = await cloudinary.uploader.upload(e.path, {resource_type: "auto", folder: "client_and_server_proj", use_filename: true, unique_filename: true})
        const uploadOptions = {
        resource_type: "auto",
        folder: "client_and_server_proj",
        use_filename: true,
        unique_filename: true
    };
        if (isVideo) {
        uploadOptions.eager = [{ effect: "volume:40dB" }];
        uploadOptions.eager_async = true;
        };
        //const finalUrl = (temp.eager && temp.eager.length > 0) ? temp.eager[0].secure_url : temp.secure_url;
        //uploads.push({ ...temp, finalUrl });
       let temp = await cloudinary.uploader.upload(e.path, uploadOptions);

    // 5. Safe URL Extraction (Uses boosted URL for videos, normal secure_url for images)
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

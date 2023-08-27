const multer = require('multer');

module.exports = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000 }
});
// console.log(req.body, '---', req.file);
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads');
//       },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
    
// });
// module.exports = multer({
//   storage: storage,
//   limits: { fileSize: 500000 }
// });


// ****Multer S3 Bucket****

// const multer = require("multer");
// const multerS3 = require('multer-s3');
// const aws = require('aws-sdk');

// aws.config.update({
//     secretAccessKey: 'oFJNCMa7wCCIOLh7WMxSRwPB3CufNgk3SVXvHmcM',
//     accessKeyId: 'AKIAZ32E2PNK67MEH4GM',
//     region: 'us-east-1'
// });

// const s3 = new aws.S3();
// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'wavess3',
//         key: function (req, file, cb) {


//             const str = file.originalname;

//             const extension = str.substr(str.lastIndexOf("."));
//             const fileName = Date.now() + '' + Math.round(Math.round(Math.random() * 5000)) + '' + extension;
//             cb(null, 'public_asset/' + fileName);
        

//         }
        
//     }
//     )
    
// });

// module.exports = upload





// ************Multer Only**************
const multer = require("multer");
const Path = require('path');
const fs = require('fs');




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
  
      const DIR = Path.join(__dirname, './public/');
      if (!fs.existsSync(DIR)) {
        fs.mkdirSync(DIR);
      }
      cb(null, DIR)
    },
    filename: function (req, file, cb) {
      const str = file.originalname;
      const extension = str.substr(str.lastIndexOf("."));
      const fileName = Date.now() + '' + Math.round(Math.round(Math.random() * 5000)) + '' + extension;
      cb(null, fileName)
    }
  });
  
  const upload = multer({ storage: storage })


module.exports = upload

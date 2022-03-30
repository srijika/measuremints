const db = require('../db/conn');
const {Sub_Category , Mint , Attribute, Calendar_Event } = db;
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const imagePath = require('../helper/imagePath');
var mongoose = require('mongoose');
const console = require('console');




module.exports = {
    createCalendar: async (req, res, next) => {
        const { username, dob, relation ,subcategory_attribte , user_id} = req.body;
        let attribute_tags =JSON.parse(subcategory_attribte)
        var username_id = new mongoose.Types.ObjectId()
        let reqFiles = req.files;
        if (!username || !dob || !relation) {
            res.send({ status: 200, message: "Required Parameter is missing" });
            return;
        }

 


        //Multer
        let filename;
        if(reqFiles.length > 0) {

            reqFiles.forEach(E => {
                var filePath = path.join(__dirname, '../../public/mints/');
                if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath);
            }
            
            const fileUrl = filePath + E.filename;
            sharp(E.path).toFile(fileUrl, function (err) {
                if (err) {
                    console.log(err)
                }
            });      
            filename = `${imagePath}/mints/${E.filename}`;
            });
        }
       
        let jsonData = {
            username: username, 
            dob: dob,
            relation: relation, 
            user_id : user_id ,
            username_id : username_id
            
        };
        jsonData.media = filename

            //Multer S3 Bucket    
            // if (req.files && req.files[0] && req.files[0].location) {
            //     jsonData['media'] = req.files[0].location;
            //     avatar = req.files[0].location;
            // }

            if(attribute_tags.length !== 0) {
                attribute_tags.map(async(value, key) =>{
const data = {
    username_id : username_id ,
    subcategory_id : value.subcategory_id ,
    attribute : value.attribute 

}
          await (new Attribute(data)).save();

                })
            }

      
        Mint.create(jsonData).then((data) => {
            res.send({ status: 200, message: `${username} Mint Create Successfully` })
            return;
        }).catch((err) => {
            res.send({ status: 400, message: err.errmsg })
            return;
        });

    },
}

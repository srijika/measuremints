const db = require('../db/conn');
const {Sub_Category , Mint , Attribute } = db;
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const imagePath = require('../helper/imagePath');
var mongoose = require('mongoose');
const console = require('console');


let testArray = [
    
    {
        "category_id":"6239bd7df797e69da78dd3f6" ,
        "subcategory_tags":[
             {"subcategory_id":"6239bdd3f797e69da78dd416","tags":[ "8" , "9"]},
             {"subcategory_id":"6239bde1f797e69da78dd422","tags":[]},
             {"subcategory_id":"6239bdf0f797e69da78dd42e","tags":["L" ]}
            ]  
    }
    
    ,
    
     {
        "category_id":"6239bd97f797e69da78dd3fe" ,
        "subcategory_tags":[
             {"subcategory_id":"6239be0df797e69da78dd43a","tags":[ "Taitnic"]},
             {"subcategory_id":"6239be1df797e69da78dd446","tags":[ ]},
             {"subcategory_id":"6239be30f797e69da78dd452","tags":[ ]}
            ] 
        
        
    }
    
    ,
    
     {
        "category_id":"6239bdaef797e69da78dd405" ,
        "subcategory_tags":[
             {"subcategory_id":"6239be44f797e69da78dd45e","tags":[]}
            ] 
        
        
    } 
    
    ,
    
     {
        "category_id":"6239bdb5f797e69da78dd40c" ,
        "subcategory_tags":[
             {"subcategory_id":"6239be4df797e69da78dd46a","tags":[ ]}
           
            ] 
        
        
    }


]




module.exports = {
    createMint: async (req, res, next) => {
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

    getUserMintAttribute: async(req, res, next) => {

        try {
            const { username_id  ,subcategory_id} = req.body;
            if ( !username_id || !subcategory_id) {
                res.send({ status: 400, message: "Required Parameter is missing" });
                return;
            }
    
            let attribute = await Attribute.findOne({username_id : username_id , subcategory_id}).lean().exec();

            if(attribute){
                res.send({
                    status: 200,
                    attribute: attribute.attribute,
                    message: "Attribute get sucessfully",
    
                  
                });
            }else{
                res.send({
                    status: 200,
                    attribute: [],
                    message: "no attribute found",
    
                  
                });
            }
           
             
        } catch (e) {
            res.send({ status: 400, message: e.message })
        }
        
       

    },

    getMyMint: async(req, res, next) => {
        try {
            const { user_id  } = req.body;
            if ( !user_id ) {
                res.send({ status: 400, message: "Required Parameter is missing" });
                return;
            }
    
            let mints = await Mint.find({user_id}).lean().exec();
           let myMint = await Promise.all( mints &&  mints.map(async (val) =>{
                let subcategory = []
                // let attribute = await Attribute.find({username_id : val.username_id })
                let condition = { "username_id" : val.username_id  };
                let attribute = await Attribute.aggregate([
                    { $match: condition },
                    { $lookup: { from: 'sub_categories', localField: 'subcategory_id', foreignField: '_id', as: 'subcategoryInfo' } },
                    { $unwind: { path: '$subcategoryInfo', preserveNullAndEmptyArrays: true } }, 
                    {
                        $project: {
                                        "_id": 0,
                                        username_id: 1,
                                        'subcategory_name': "$subcategoryInfo.name",
                                        subcategory_id: 1,
                                        attribute: 1,
                                        created_at: 1,    
                
                        }
                    },
                ]).exec();

                if(attribute.length !== 0){
                    subcategory = attribute
                }

               val.subcategory = subcategory
              
             return val
                

            }));
            console.log("myMint" ,myMint)


            if(myMint.length !== 0 ){
                res.send({
                    status: 200,
                    myMint: myMint,
                    message: "My Mint get sucessfully",
    
                  
                });
            }else{
                res.send({
                    status: 200,
                    attribute: [],
                    message: "no found",
    
                  
                });
            }
           
             
        } catch (e) {
            res.send({ status: 400, message: e.message })
        }
        
    },

    getUserMint: async(req, res, next) => {
        try {
            const { username_id  } = req.body;
            if ( !username_id ) {
                res.send({ status: 400, message: "Required Parameter is missing" });
                return;
            }
    
            let userMint = await Mint.findOne({username_id}).lean().exec();

            if(userMint){
                res.send({
                    status: 200,
                    userMint: userMint,
                    message: `${userMint.username} Mint get sucessfully`,
    
                  
                });
            }else{
                res.send({
                    status: 200,
                    attribute: [],
                    message: "no found",
    
                  
                });
            }
           
             
        } catch (e) {
            res.send({ status: 400, message: e.message })
        }
        
    },


   

    updateUserMintAttribute: async(req, res, next) => {

        try{
        const { username_id, subcategory_id ,attribute } = req.body;
        let attribute_tags =JSON.parse(attribute)

        console.log("attribute" ,typeof(attribute),attribute)
        console.log("attribute_tags" ,typeof(attribute_tags) ,attribute_tags)
        console.log("attribute_tags.length !== 0" ,attribute_tags.length !== 0)


        

        if (!username_id || !subcategory_id ||!attribute_tags) {
            res.send({ status: 400, message: "Required Parameter is missing" });
            return;
        }

        // Attribute.updateOne( { subcategory_id: subcategory_id  , username_id : username_id}, { $set: { attribute: [] }} , {upsert: true}, function(err, affected){         });

        if(attribute_tags.length !== 0){
        console.log("add")

            Attribute.updateOne( { subcategory_id: subcategory_id  , username_id : username_id}, { $set: { attribute: attribute_tags }}, {upsert: true}, function(err, affected){  
                console.log("affected" ,affected)
                       });

            res.send({ status: 200,attribute : attribute_tags, message: "Attribute update successfuly" });

        }
        else{
        console.log("delete")

            await Attribute.deleteOne( { subcategory_id: subcategory_id  , username_id : username_id});
            res.send({ status: 200, message: "remove all attribute successfuly" });

        }
        
    } catch (e) {
        res.send({ status: 400, message: e.message })
    }

        
    },

}

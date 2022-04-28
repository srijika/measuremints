const db = require('../db/conn');
const {Favorite } = db;
const mongoose = require("mongoose");


module.exports = {
    addFavorite: async (req, res, next) => {

        const { user_id, favorite_user_id} = req.body;
        if (!user_id || !favorite_user_id) {
            res.send({ status: 400, message: "Required Parameter is missing" });
            return;
        }

        const jsonData = {
            user_id: user_id,
            favorite_user_id: favorite_user_id,
        };

        const findFavorite = await Favorite.findOne(jsonData)

        if(findFavorite){
          return  res.send({ status: 400, message: 'Already add in favorite list' })

        }

        Favorite.create(jsonData).then((data) => {
            res.send({ status: 200, message: "Add In Favorite List Successfully" })
            return;
        }).catch((err) => {
            res.send({ status: 400, message: err.errmsg })
            return;
        }); 

    },

    removeFavorite: async (req, res, next) => {
        const { user_id, favorite_user_id} = req.body;

        if (!user_id || !favorite_user_id) {
            res.send({ status: 400, message: "Required Parameter is missing" });
            return;
        }

        const removeData = {
            user_id: user_id,
            favorite_user_id: favorite_user_id,
        };


        Favorite.deleteOne(removeData).then((data) => {
            res.send({ status: 200, message: "Remove From Favorite List Successfully" })
        }).catch((err) => {
            res.send({ status: 400, message: err.message })
            return;
        });
    },

    getMyFavorite: async(req, res, next) => {
        try{
        const { user_id } = req.body;

        if (!user_id) {
            res.send({ status: 400, message: "Required Parameter is missing" });
            return;
        }

        const FavoriteList = await Favorite.aggregate([
            {
                $match: {
                    user_id: mongoose.Types.ObjectId(user_id)
                }
              },
            {
            $lookup: {
                from: 'users',
                localField: 'favorite_user_id',
                foreignField: "_id",
                as: "userInfo"
            }
        },
        {
            $unwind: {
                path: '$userInfo',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                user_id: 1,
                favorite_user_id: 1,

                'username': "$userInfo.username",
                'avatar': "$userInfo.avatar",
                'dob': "$userInfo.dob",
                 created_at : 1
            }
        },
      
    ]);

    res.send({ status: 200, FavoriteList : FavoriteList, message: `Get FavoriteList Successfully` })


}catch(error){
    res.send({status: 400, message: error.message})
    return;
}

    },


   
}

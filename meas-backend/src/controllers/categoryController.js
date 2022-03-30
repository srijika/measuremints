const db = require('../db/conn');
const {Category , Sub_Category } = db;

module.exports = {
  getCategoryList: async (req, res, next) => {
    try {
        const reqBody = req.body;
        const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
        const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;

        const catLent = await Category.count({ status: 0 });

        Category.find({ status: 0 }).sort({ updated_at: -1 }).limit(Limit).skip(Limit * PageNo).then(category => {
            res.send({ status: true, message: "Category List", result: category, count: catLent });
        })
    } catch (err) {
        res.send({ status: false, message: "Something went wrong" });
    }
},

createCategory: async (req, res, next) => {
    try {
        if (req.body.category_name) {
            let data = {
                category_name: req.body.category_name
            }

            let findCategory = await Category.find({category_name : req.body.category_name})
            if(findCategory.length > 0){
                res.send({ status: false, message: "Category Name Already Exits"});
                return false;
            }

            Category.create(data).then(user => {
                res.send({ status: true, message: "Category Created" });
            }).catch(e => {
                res.send({ status: false, message: e.message });
            })
        } else {
            res.send({ status: false, message: "Something went wrong" });
        }
    } catch (err) {
        res.send({ status: false, message: "Something went wrong" });
    }
},
updateCategory: async (req, res, next) => {
    try {
        if (req.body.id && req.body.category_name) {
            let findCategory = await Category.find({_id: {$ne: req.body.id} ,category_name : req.body.category_name})

            if(findCategory.length > 0){
                res.send({ status: false, message: "Category Name Already Exits"});
                return false;
            }

            Category.findOneAndUpdate({ _id: req.body.id }, { $set: { category_name: req.body.category_name } }).then(user => {
                res.send({ status: true, message: "Category Successfully updated" });
            }).catch(e => {
                res.send({ status: false, message: e.message });
            })
        } else {
            res.send({ status: false, message: "Something went wrong" });
        }
    } catch (err) {
        res.send({ status: false, message: "Something went wrong" });
    }
},
deleteCategory: async (req, res, next) => {
    try {
        if (req.body.id) {
            Category.findOneAndRemove({ _id: req.body.id }).then(user => {
                res.send({ status: true, message: "Category Successfully deleted" });
            }).catch(e => {
                res.send({ status: false, message: e.message });
            })
        } else {
            res.send({ status: false, message: "Something went wrong" });
        }
    } catch (err) {
        res.send({ status: false, message: "Something went wrong" });
    }
},


getUserCategoryList: async (req, res, next) => {
    try {


        let categoryList = await Category.find();
        res.send({ status: 200, message: "Category List Get Successfully", List : categoryList  });

    } catch (err) {
        res.send({ status: 400, message: "Something went wrong" });
    }
},
};

  
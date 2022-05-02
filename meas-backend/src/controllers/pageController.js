const db = require('../db/conn');
const {  Page } = db;


module.exports = {
  createPages: async (req, res, next) => {
      try {
          const reqBody = req.body;
          reqBody.loginid = req.user._id;
         let title = req.body.title;
          let findTitle = await Page.find( {title: title });

          if(findTitle.length > 0){
              res.send({ status: false, message: "Title Already Exits"});
              return false;
          
          }

      
          
          title = title.toLowerCase();
          let slug = title.replace(" ", "_");

          let data = {
              title : reqBody.title ,
              slug : slug ,
              description : reqBody.description ,

              loginid : reqBody.loginid ,
              isActive : reqBody.isActive === undefined || reqBody.isActive === false ? false : true ,

          }
          const pageModel = new Page(data);
          const created = await pageModel.save();
          return res.send({ status: true, data: created._id, message: 'Page created successfully' });

      } catch (error) {
          return res.send({ status: false, message: error.message });
      }
  },

  updatePages: async (req, res, next) => {
      try {
          const reqBody = req.body;
          const Id = reqBody._id;
          let title = req.body.title;
          console.log("update",reqBody)

          reqBody.isActive = reqBody.isActive === '' ? false : true



          if (!Id) {
              return res.send({ status: false, message: 'Id is required' });
          }

          let findTitle = await Page.find( {_id: {$ne: Id} ,title: title });
          if(findTitle.length > 0){
              res.send({ status: false, message: "Title Already Exits"});
              return false;
          
          }

          title = title.toLowerCase();
          reqBody.slug = title.replace(" ", "_");
          await Page.findByIdAndUpdate(Id, reqBody).lean().exec();

          return res.send({ status: true, message: 'Page updated successfully' });

      } catch (error) {
          return res.send({ status: false, message: error.message });
      }
  },

  getPages: async (req, res, next) => {
  
      try {
          const reqQuery = req.query;
          const slug = reqQuery.slug;

          if (!slug) {
              return res.send({ status: false, message: 'slug is required' });
          }
     

          const Static_Page = await Page.find({slug: slug}).lean().exec();



          if (!Static_Page) {
              return res.send({ status: false, message: 'Page not fount for this slug' });
          }

          return res.send({ status: true, data: Static_Page, message: slug+' get successfully' });

      } catch (error) {
          return res.send({ status: false, message: error.message });
      }
  },
  getPageSlug: async (req, res, next) => {
      try {
          const {slug} = req.body
          if (!slug) {
              return res.send({ status: 400, message: 'slug is required' });
          }

          const SinglePage = await Page.findOne({slug: slug}).lean().exec();

          if (!SinglePage) {
              return res.send({ status: 400, message: 'Page not fount for this slug' });
          }
console.log("Page" ,SinglePage)
          return res.send({ status: 200, data: SinglePage, message: slug+' get successfully' });

      } catch (error) {
          return res.send({ status: 400, message: error.message });
      }
  },

  getAllPages: async (req, res, next) => {
      try {
          let _id = req.body._id;
const reqBody = req.body;



          const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10; 
          const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;


          const AllPages = await Page.find().sort({ updated_at: -1 }).skip(Limit * PageNo).limit(Limit).lean().exec();
          const count = await Page.count();

          let isuser  = false
return res.send({ status: true, data: AllPages, count: count, message: 'All Page get successfully'  ,   });

      } catch (error) {
          return res.send({ status: false, message: error.message });
      }
  },

  deletePages: async (req, res, next) => {
      try {
          const reqQuery = req.query;
          const slug = reqQuery.slug;

          if (!slug) {
              return res.send({ status: false, message: 'slug is required' });
          }

          const deleted = await Page.findOneAndRemove({slug: slug}).lean().exec();

          if (!deleted) {
              return res.send({ status: false, message: 'Page not found' });
          }

          return res.send({ status: true, message: 'Page deleted successfully' });

      } catch (error) {
          return res.send({ status: false, message: error.message });
      }
  },

  statusUpdate: async (req, res, next) => {
      try {
          const reqBody = req.body;
          const Id = reqBody._id;
          const isActive = reqBody.isActive ? true : false;

          if (!Id) {
              return res.send({ status: false, message: 'Id is required' });
          }

          await Page.findByIdAndUpdate(Id, { isActive: isActive }).lean().exec();

          return res.send({ status: true, message: 'Status updated successfully' });

      } catch (error) {
          return res.send({ status: false, message: error.message });
      }
  },



}

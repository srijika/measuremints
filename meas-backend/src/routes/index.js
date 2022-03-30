// Importing express module
const express = require("express")
const rootRouter = express.Router()

//****START ROUTES****
// USER
const user_auth = require('./user/auth');
const mint = require('./user/mint');



// ****ADMIN****
const admin_auth = require('./admin/auth');
const dashboard = require('./admin/admin')
const user_managment = require('./admin/user')
const setting = require('./admin/setting')
const page = require('./admin/page')
const category = require('./admin/category')
const sub_category = require('./admin/sub_category')



//****END ROUTES****





//****Combine Routes****
// USER
rootRouter.use('/', user_auth);
rootRouter.use('/', mint);


// ADMIN
rootRouter.use('/', admin_auth);
rootRouter.use('/', dashboard);
rootRouter.use('/', user_managment);
rootRouter.use('/', setting);
rootRouter.use('/', page);
rootRouter.use('/', category);
rootRouter.use('/', sub_category);



//Export Routes
module.exports = rootRouter;
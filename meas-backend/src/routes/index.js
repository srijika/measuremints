// Importing express module
const express = require("express")
const rootRouter = express.Router()

//****START ROUTES****
// USER
const user_auth = require('./user/auth');
const mint = require('./user/mint');
const calendar_event = require('./user/calendar_event');
const favourite = require('./user/favourite');
const mint_request = require('./user/mint_request')


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
rootRouter.use('/', calendar_event);
rootRouter.use('/', favourite);



// ADMIN
rootRouter.use('/', admin_auth);
rootRouter.use('/', dashboard);
rootRouter.use('/', user_managment);
rootRouter.use('/', setting);
rootRouter.use('/', page);
rootRouter.use('/', category);
rootRouter.use('/', sub_category);
rootRouter.use('/', mint_request);





//Export Routes
module.exports = rootRouter;
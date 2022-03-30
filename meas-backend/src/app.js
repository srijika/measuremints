const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors');
const indexRouter = require('./routes/index');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb'
}));

// parse application/json
app.use(bodyParser.json({
  limit: '50mb'
}));

//Allow Cors
app.use(cors());

//Set Static Path
app.use(express.static(path.join(__dirname, '../public')));

//Set All Routes
app.use('/', indexRouter);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
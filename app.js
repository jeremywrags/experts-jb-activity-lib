var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

//** Jeremy Added for Postgres API */
const bodyParser = require("body-parser");
require('dotenv').config();
const cors = require("cors");
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
//app.use(express.urlencoded({ extended: false }));

const db = require("./models");
//**This code will force the tables to drop and recreate. For productions comment out this code and run the line below. */
//db.sequelize.sync({ force: true }).then(() => {
//  console.log("Drop and re-sync db.");
//});
db.baseline.sequelize.sync();

//**This code will force the tables to drop and recreate. For productions comment out this code and run the line below. */
//db.jblib.sequelize.sync({ force: true }).then(() => {
//  console.log("Drop and re-sync db.");
//});
db.jblib.sequelize.sync();
var dbRouter = require("./routes/database.routes");
app.use('/api', dbRouter);

//** End of Jeremy updates */

var port = process.env.PORT || 3000;

//Define app routes
var indexRouter = require('./routes/index');
var triggerEmailRouter = require('./routes/triggerEmail');
var activityRouter = require('./routes/jbActivity');
var apiRouter = require('./routes/api');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(__dirname + '/node_modules/@salesforce-ux/design-system/assets/'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));

//Include app routes
app.use('/', indexRouter);
app.use('/triggerEmail', triggerEmailRouter);
app.use('/jbActivity', activityRouter);
app.use('/api', apiRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  let appName = "Error"
  res.render('error', { title : appName, appName : appName });
});

app.listen(port);

module.exports = app;

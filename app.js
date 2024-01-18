var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const rewriteMiddleware = require('./middlewares/rewriteMiddleware');


//console.log(process.env.JWT_PASSWORD);
//const paymentController = require('./controllers/paymentController');
// const stripe = require('./routes/paymentRouter');

var app = express();

connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  origin:['https://abcrealestate.onrender.com','http://localhost:3000']
}))

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, './build')));

// Use the rewrite middleware
app.use(rewriteMiddleware);

// Enable CORS for all routes
// app.use(cors());

// app.use(cors({
//   origin: '*',
//   credentials: true,
// }));

var indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');
var usersRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const paymentRouter = require('./routes/paymentRouter');
const stripeWebHook = require('./controllers/stripeWebhook');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter);
app.use('/payment', paymentRouter);
app.use('/webhook', stripeWebHook);

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
  res.render('error');
});

  // port number defined in bin > www file


module.exports = app;

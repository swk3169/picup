var db_config = require('./config/db-config.json');
var session_config = require('./config/session-config.json');

var express = require('express');
var session = require('express-session');

var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');

var routes= require('./routes/index');
var authRouter = require('./routes/auth');
var memberRouter = require('./routes/member');
var boardRouter = require('./routes/board');
var friendRouter = require('./routes/friend');

DB_URL = db_config.url;
SESSION_KEY = session_config.secret;

mongoose.Promise = global.Promise;  
mongodb = DB_URL
mongoose.connect(mongodb);

var db = mongoose.connection;

db.once('open', function () {
   console.log('DB connected!');
});

db.on('error', function (err) {
  console.log('DB ERROR:', err);
});

var app = express();

app.use(bodyParser.urlencoded({ extended: true })) // content-type header를 보고 urlencoded body를 parse해줌. extended로 string, array외의 type을 받을수 있도록함.
app.use(bodyParser.json());

app.use(session({
	secret: SESSION_KEY, //keboard cat (랜덤한 값)
	resave: false,  // 세션을 언제나 저장할 지 (변경되지 않아도) 정하는 값
	saveUninitialized: true  // 세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장
}));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type, authroization');
  next();
});  



app.use('/', routes);
app.use('/auth', authRouter);
app.use('/api/member', memberRouter);
app.use('/api/board', boardRouter);
app.use('/api/friend', friendRouter);

module.exports = app;

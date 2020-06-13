const db_config = require('./config/db-config.json');
const session_config = require('./config/session-config.json');

const express = require('express');
const session = require('express-session');
const path = require('path');

const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');

const FileStore = require('session-file-store')(session);

const routes= require('./routes/index');
const authRouter = require('./routes/auth');
const memberRouter = require('./routes/member');
const boardRouter = require('./routes/board'); // for test geo data
const friendRouter = require('./routes/friend');
const messageRouter = require('./routes/message');

const testRouter = require('./routes/test');   // 동영상 file upload 테스트

const helmet = require('helmet'); // HTTP 헤더를 설정하여 웹 취약성으로부터 정보를 보호하는 모듈

const DB_URL = db_config.url;
const SESSION_KEY = session_config.secret;

mongoose.Promise = global.Promise;
mongoose.connect(DB_URL);

var db = mongoose.connection;

db.once('open', function () {
   console.log('DB connected!');
});

db.on('error', function (err) {
  console.log('DB ERROR:', err);
});

var app = express();

app.use(express.static('dist'));
app.use(express.static('upload'));

app.use(bodyParser.urlencoded({ extended: true })) // content-type header를 보고 urlencoded body를 parse해줌. extended로 string, array외의 type을 받을수 있도록함.
app.use(bodyParser.json());

app.use(session({
	secret: SESSION_KEY, //keboard cat (랜덤한 값)
	resave: false,  // 세션을 언제나 저장할 지 (변경되지 않아도) 정하는 값
  saveUninitialized: true,  // 세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장
  store:new FileStore()
}));

//app.use(helmet());  // 헤더 보안
//app.use(helmet.noCache());
//app.use(helmet.xssFilter());
//app.use(helmet.noSniff());
//app.disable('x-powered-by');

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
app.use('/api/message', messageRouter);
app.use('/api/test', testRouter);

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.redirect('/');
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

module.exports = app;

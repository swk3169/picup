var express = require('express');
//var cors = require('cors');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');

var fs = require('fs');

var routes= require('./routes/index')
var auth = require('./routes/auth')
var member = require('./routes/member')

var app = express();

MONGO_LINK = fs.readFileSync('config/mongodb_link.conf', 'utf-8')

mongoose.Promise = global.Promise;  
mongodb = MONGO_LINK
mongoose.connect(mongodb);

var db = mongoose.connection;

db.once('open', function () {
   console.log('DB connected!');
});

db.on('error', function (err) {
  console.log('DB ERROR:', err);
});

//app.use(cors()); // cors 허용. cors: cross origin resource sharing, 현재 도메인과 다른 도메인으로 리소스가 요청될 경우
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    //res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); 
    res.header('Access-Control-Allow-Headers', 'content-type, authroization');
    next();
  });

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// app.use('/users', express.static('upload')); localhost/users로 접근시 server의 upload 폴더에 있는 파일 접근가능

app.use('/', routes)
app.use('/auth', auth)
app.use('/member', member)

module.exports = app;
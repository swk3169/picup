// file upload test

var express = require('express');
var router = express.Router();
var fs = require('fs');
var jwt = require('jsonwebtoken');
var multer = require('multer');
var jimp = require('jimp');
var ExifImage = require('exif').ExifImage;
const Transaction = require('mongoose-transactions')

const cors = require('cors');

var Member = require('../models/Member');
var Board = require('../models/Board');
var Picture = require('../models/PictureWithGeo');
var Party = require('../models/Party');
var Tag = require('../models/Tag');
var Post = require('../models/PostWithGeo');
var Comment = require('../models/Comment');
var Message = require('../models/Message');

var mongoose = require('mongoose');

var async = require('async')

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    //req.dirname = 'upload/temp';
    callback(null, 'upload/temp');
  },
  filename: function(req, file, callback) {
    var idx = file.originalname.lastIndexOf('.');
    console.log(file);

    var filename = Date.now() + file.originalname.substring(idx).toLowerCase();
    //req.filename = filename;
    //req.mimetype = file.mimetype;

    callback(null, filename);
  }
});

var upload = multer({ storage: storage });

router.use(cors());

router.post('/uploadfiles', upload.array('files[]'), async function(req, res, next){ // board에 글쓰기
  console.log('POST /api/test/uploadfiles');

  for (var i = 0; i < req.files.length; ++i) {
    var file = req.files[i];
    console.log(file);
    console.log(file.buffer);
    console.log(file.mimetype);
    /*
    var image = await jimp.read(file.buffer);
    var thumnailBuffer = await (new Promise((resolve, reject) => { // await를 통해 promise가 return할때 까지 기다림
      image.resize(50, 50).getBuffer(file.mimetype, (error, buf) => {
        return error ? reject(error) : resolve(buf);
      });
    })).then((buf) => {
      return buf;
    }).catch((error) => {
      return null;
    });
    
    if (!thumnailBuffer)
      return res.json(util.successFalse('error occured!'));
    */
  }

  return res.json('done');
});

// 이미지 파일 저장 후 jimp로 buffer로 변경
router.post('/uploadfiles2', upload.array('files[]'), async function(req, res, next){ // board에 글쓰기
  console.log('POST /api/test/uploadfiles');

  for (var i = 0; i < req.files.length; ++i) {
    var file = req.files[i];
    console.log(file.mimetype);
    if (file.mimetype == 'image/jpeg') {
      console.log(file.destination);
      console.log(file.filename);

      var dir = file.destination;
      var filename = file.filename;
      var buffer = fs.readFileSync(dir + '/' + filename);
      console.log(buffer);
    }
    else {
      console.log('it is viedo!');
    }
    /*
    var img = await (jimp.read(file.destination + '/' + file.filename)
    .then( async img => {

      var buffer = await (new Promise((resolve, reject) => { // await를 통해 promise가 return할때 까지 기다림
        img.getBuffer(file.mimetype, (error, buf) => {
          return error ? reject(error) : resolve(buf);
        });
      })).then((buf) => {
        return buf;
      }).catch((error) => {
        return null;
      });
  
      console.log('in jimp read');
      console.log(buffer);
      //var buffer = await (img.getBufferAsync(file.mimetype));
      return img;
    })
    .catch( err => {
      console.log(err);
      return null;
    }));
    */

    //var buffer = await (img.getBufferAsync(file.mimetype));

    //console.log(file);
    //console.log(file.buffer);
    //console.log(file.mimetype);
    //console.log(img);
    //console.log(buffer);
    /*
    var image = await jimp.read(file.buffer);
    var thumnailBuffer = await (new Promise((resolve, reject) => { // await를 통해 promise가 return할때 까지 기다림
      image.resize(50, 50).getBuffer(file.mimetype, (error, buf) => {
        return error ? reject(error) : resolve(buf);
      });
    })).then((buf) => {
      return buf;
    }).catch((error) => {
      return null;
    });
    
    if (!thumnailBuffer)
      return res.json(util.successFalse('error occured!'));
    */
  }

  return res.json('done');
});

router.get('/vrcamera', function(req, res) {
  console.log(res);
  var html = `<html>
  <head>
  </head>
  <body>
      <div id="vrview">
        hi
        <iframe src="//storage.googleapis.com/vrview/2.0/index.html?image=//storage.googleapis.com/vrview/examples/coral.jpg&is_stereo=true">
        </iframe>
        <iframe src="//storage.googleapis.com/vrview/2.0/index.html?video=http://localhost:4000/temp/1537502215991.mp4&is_stereo=true"></iframe>
      </div>
  </body>
</html>`

  res.send(html);
});

router.get('/staticfile', function(req, res){
  res.send('Hello Router, <img src="/temp/1537502880785.jpg">')
})

module.exports = router;

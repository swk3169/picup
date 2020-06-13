var express = require('express');
var router = express.Router();
var Member = require('../models/Member');
var util = require('../utils');

const sharp = require('sharp');  // for image resize
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    req.dirname = 'upload/temp'  // dirname을 request 객체에 넣어줌
    cb(null, 'upload/temp');  // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function(req, file, cb) {
    var idx = file.originalname.lastIndexOf(".");

    // file.fieldname: 폼에 정의된 필드명(name)
    // originalname: 사용자가 업로드한 파일명
    var filename = file.fieldname + '-' + Date.now() + file.originalname.substring(idx).toLowerCase();
    req.filename = filename // filename을 request 객체에 넣어줌

    cb(null, filename);  // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
});

var upload = multer({ storage: storage })

//console.log(util)
//var mongoose   = require('mongoose');
//const Member = mongoose.Model('member')

// index
router.get('/', util.isLoggedin, function(req,res,next){
  Member.find({})
  .sort({member_id:1})
  .exec(function(err,users){
    res.json(err||!users? util.successFalse(err): util.successTrue(users));
  });
});
  
// create
router.post('/', upload.single('memberProfile'), function(req,res,next){
  console.log(req.headers)
  
  //var bearerHeader = ;
  var token = util.ensureAuthorized(req.headers['authorization'])
  //let decoded = util.decodeToken(token)

  console.log(token)
  //console.log(decoded)
  //console.log(bearerHeader)
  console.log(req.body)

  if (req.filename) {
    var idx = req.filename.lastIndexOf(".");
    var onlyfilename = req.filename.substring(0, idx) + '_resize'
    var fileFormat = req.filename.substring(idx)

    console.log(onlyfilename)
    console.log(fileFormat)
    const path = req.dirname + '/' + req.filename  // // memberProfile.png
    const savePath = req.dirname + '/' + onlyfilename + fileFormat  // memberProfile_resize.png

    sharp(path)  // sharp 모듈을 사용하여 path image를 불러와 resize 후 savePath에 저장
    .resize(50, 50)
    .toFile(savePath, function(err, info) {
      console.log(err);
      console.log(info)
    });
  }

  res.send('aa')
  //var newMember = new Member(req.body);
  //newMember.save(function(err,user){
  //  res.json(err||!user? util.successFalse(err): util.successTrue(user));
  //});
});

module.exports = router
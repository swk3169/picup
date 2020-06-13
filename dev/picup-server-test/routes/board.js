// 모델 변경(Picture->PictureWithGeo, Post->PostWithGeo)

/*
 GET /board?name='게시판 이름' => 게시판 검색
 POST /board => 게시판 생성(그룹 생성)
 GET /board/me => 나의 게시판 목록 조회(내 그룹 조회)
 GET /board/map?lat='위도'&long='경도'&tag='태그' => 위치 주변 태그 검색
 GET /board/:id => 게시판 정보
 GET /board/:id/post => 게시물 조회
 GET /board/:id/map => 게시물 위치 정보 조회
 GET /board/:id/map?lat='위도'&long='경도' => 위치 주변 게시판 게시물 검색(게시판의 올린 게시물 중 위치 주변에 있는 게시물을 조회) 
 POST /board/:id/post => 글 작성
 GET /board/:id/post/:post_id => 상세 게시물 조회
 PUT /board/:id/post/:post_id => 상세 게시물 수정
 GET /board/:id/post/:post_id/comment => 댓글 조회
 POST /board/:id/post/:post_id/comment => 댓글 작성

 next:
 POST /board/:id/invitation => 회원 초대
 GET /board/:id/invitation => 회원 초대 가능 목록
 GET /board/:id/member/me => 그룹 권한 여부 반환(가입 여부, 글쓰기 여부)
 POST /board/:id/member/me => 회원 가입
 DELETE /board/:id/member/me => 회원 탈퇴
 GET /board/:id/member => 회원 목록
*/

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var multer = require('multer');
var jimp = require('jimp');
var fs = require('fs');
var ExifImage = require('exif').ExifImage;
const Transaction = require('mongoose-transactions')

var util = require('../utils');
var permission = require('../permission');

var Member = require('../models/Member');
var Board = require('../models/Board');
var Picture = require('../models/Picture');
var Party = require('../models/Party');
var Tag = require('../models/Tag');
var Post = require('../models/Post');
var Comment = require('../models/Comment');
var Message = require('../models/Message');
var Pick = require('../models/Pick');
var memberQuery = require('../query/memberQuery');
var friendQuery = require('../query/friendQuery');
var partyQuery = require('../query/partyQuery');
var boardQuery = require('../query/boardQuery');
var postQuery = require('../query/postQuery');

var jwt_config = require('../config/jwt-config.json');
var JWT_SECRET = jwt_config.secret;

var mongoose = require('mongoose');

var async = require('async')

/*
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    //req.dirname = 'upload/temp';
    callback(null, 'upload/temp');
  },
  filename: function(req, file, callback) {
    var idx = file.originalname.lastIndexOf('.');
    
    var filename = file.fieldname + '-' + Date.now() + file.originalname.substring(idx).toLowerCase();
    //req.filename = filename;
    //req.mimetype = file.mimetype;

    callback(null, filename);
  }
});
*/
//var storage = multer.memoryStorage()

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    //req.dirname = 'upload/temp';
    callback(null, 'upload/resource');
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

router.use(util.isLoggedin);

router.get('/', async function(req, res) {
  console.log('GET /api/board?name=')
  if (req.query.name) {
    Board.find({boardName: { "$regex": req.query.name, "$options": "i" }, boardKind: 0}) // 공개 그룹 중 name을 포함하는 게시판 검색
    .select(['boardName', 'boardKind', 'boardProfile', 'totalLike']) 
    .then( async (boards) => {
      console.log(boards);

      for (var i = 0; i < boards.length; ++i) {
        boards[i] = boards[i].toJSON();
  
        //console.log(parties[i]);
        var boardID = boards[i]._id;
        
        var count = await (Party.count({boardID:boardID})
        .then( (result) => {
          //console.log(result);
          return result;
        })
        .catch ( (err) => {
          return 0;
        }));
  
        boards[i].numOfMember = count;
        //console.log(count);
      }

      return res.json(util.successTrue(boards));
    })
    .catch( (err) => {
      console.log(err);
      return res.json(util.successTrue(err));
    });
  }
});

// 그룹 생성
router.post('/', upload.single('boardProfile'), async function(req, res) {
  console.log('POST /api/board')
  console.log(req.body)
  var memberObjID = req.decoded._objID; 
  var boardName = req.body.boardName;
  var boardKind = req.body.isOpen == 'true' ? 0 : 1;  // 공개, 비공개
  var managerID = memberObjID;
  var canImmediateWrite = req.body.canImmediateWrite == 'true' ? true : false;  // React에서 boolean 값을 줄 경우 문자열로 줌
  var memberList = req.body.memberList;

  //console.log(canImmediateWrite)  
  if (!req.file) {
    return res.json(util.successFalse('error occured!'));
  }

  var file = req.file;

  var dir = file.destination;
  var resourcedir = dir.substr(dir.indexOf('/') + 1);

  var filename = file.filename;
  var filePath = dir + '/' + filename;  // 파일이 저장된 경로
  var resourceFilePath = resourcedir + '/' + filename // React에서 불러올 파일 경로

  var image = await jimp.read(filePath);
  image.resize(50, 50).write(filePath);

  /*
  var boardProfile = await (new Promise((resolve, reject) => { // await를 통해 promise가 return할때 까지 기다림
    image.resize(50, 50).getBuffer(req.file.mimetype, (error, buf) => {
      return error ? reject(error) : resolve(buf);
    });
  })).then((buf) => {
    return buf;
  }).catch((error) => {
    return null;
  });
  */

  /*
  if (!boardProfile) {
    return res.json(util.successFalse('error occured!'));
  }
  */
 
  var boardInfo = {
    // _id : new ObjectId() // it will be update at tranaction insert, _id값을 넣어도 transaction insert때 _id가 새로 발급된다.
    boardName: boardName,
    boardKind: boardKind,
    boardProfile: resourceFilePath,
    managerID: memberObjID,
    canImmediateWrite: canImmediateWrite
    //member_list:[{member_id: newMember.member_id, write_auth:true}] member가 많이지면 document size(16MB)를 넘어갈 수 도 있으므로 Party로 따로뺌
  };

  var partyInfo = {
    writeAuth: true,
    boardID: boardInfo._id,
    boardMemberID: memberObjID
  };

  var messageInfoList = [];
  var messageInfo;

  if (memberList) {
    for (var i = 0; i < memberList.length; ++i) {
      messageInfo = {
        catcherID: memberList[i],
        senderID: memberObjID,
        messageKind: 1,
      }
      messageInfoList.push(messageInfo);
    }
  }
  
  const transaction = new Transaction();
  try {
    var boardObjID = transaction.insert('board', boardInfo);
    
    partyInfo.boardID = boardObjID;
    transaction.insert('party', partyInfo);

    for (var i = 0; i < messageInfoList.length; ++i) {
      messageInfoList[i].inviteBoardID = boardObjID;
      transaction.insert('message', messageInfoList[i]);
    }

    const final = await transaction.run()

    console.log(boardObjID);
    return res.json(util.successTrue(boardObjID));

  } catch(err) {
    console.log(err)
    await transaction.rollback().catch(console.error)
    transaction.clean();

    return res.json(util.successFalse('error occured!'));
  }

  // return res.json(util.successTrue('done'))
});

router.get('/me', async function(req, res) { // 게시판 조회(그룹 조회), 개인 게시판은 populate에서 제외되서 null값
  console.log('GET /api/board/me');

  var memberID = req.decoded._objID;

  Party.find({boardMemberID: memberID}).select('boardID')
  .populate({
    path:'boardID',
    match: {
      boardKind : {"$in":[0, 1]} // 개인 게시판 2는 제외. 공개 그룹(0), 비공개 그룹(1)만 검색 
    }
  }) //.find({'boardID.boardKind': {"$in":[0, 1, 2]}})
  .then( async (parties) => {
    //console.log(parties);
    console.log(parties.length);
    for (var i = 0; i < parties.length; ++i) {
      parties[i] = parties[i].toJSON();
      if (!parties[i].boardID)
        continue;

      //console.log(parties[i]);
      var boardID = parties[i].boardID._id;
      
      var count = await (Party.count({boardID:parties[i].boardID._id})
      .then( (result) => {
        //console.log(result);
        return result;
      })
      .catch ( (err) => {
        return 0;
      }));

      parties[i].numOfMember = count;
      //console.log(count);
    }
    //console.log(parties);
    return res.json(util.successTrue(parties));
  })
  .catch( (err) => {
    console.log(err);
    return res.json(util.successFalse('error occured!'));
  })
});


router.get('/map', async function(req, res) {
  console.log('GET /api/board/map')
  //var memberID = req.decoded._id;
  var memberID = req.decoded._objID;
  
  // return res.json('temp');
  // readPermission = [1];
  var postList = null;
  if (req.query.lat && req.query.long && req.query.tag) {
    console.log('in lat long query');
    console.log(req.query.lat);
    console.log(req.query.long);
    console.log(req.query.tag);
    
    postList = await (Post.find({visibility: 0, tagList: {"$in":req.query.tag}})
    .populate({ path: 'postWriterID', select: 'memberName'})
    .populate({ path: 'pictureList', select: ['thumbnail', 'geo']})
    .find({'geo': {
      $near: [
        req.query.lat,
        req.query.long
      ],
      $maxDistance: 5 / 111.12 
    }
    })
    .then( (posts) => {
      //console.log('뀨뀨');
      //console.log(posts);
      return posts;
    })
    .catch( (err) => {
      console.log(err);
      return null;
    }));
    //console.log('뀨뀨');
    //console.log(postList);
    // 사진의 위치 정보가 범위에 있을 경우 
    var pictureList = await (Post.find({visibility: 0, tagList: {"$in":req.query.tag}})
    .populate({ path: 'postWriterID', select: 'memberName'})
    .populate({
      path: 'pictureList',
      select: ['thumbnail', 'geo'],
      match: {
        'geo': {
          $near: [
            req.query.lat,
            req.query.long
          ],
          $maxDistance: 5 / 111.12 
        }
      }
    })
    .then( (posts) => {
      console.log('in filter');
      return posts.filter(function(post) {
        console.log(post);
        return post.pictureList.length > 0; // populate시 match된 picture가 하나라도 있을시
      })
      //return posts;
    })
    .catch( (err) => {
      console.log(err);
      return null;
    }));

    //console.log(pictureList);
    //console.log('뀨');
    //console.log(pictureList.length);
    //console.log(pictureList[0].pictureList);
    postList = postList.concat(pictureList);
    console.log(postList);
    console.log(postList.length);
  }
  else {
    postList = await (Post.find({visibility: 0})
    .select(['geo', 'pictureList', 'tagList', 'postedBoardID'])
    .populate({ path: 'pictureList', select: ['thumbnail', 'geo']}) // modify for geo data
    .then( (posts) => {
      return posts;
    })
    .catch( (err) => {
      console.log(err);
      return null;
    }));
  }
  //console.log(postList)
  //postList = postList.toJSON();
  /** 
  for (var i = 0; i < postList.length; ++i) {
    //console.log(postList[i].pictureList);
    var pictureList = postList[i].pictureList;
    //postList[i].pictureList = pictureList
    for (var j = 0; j < pictureList.length; ++j) {
      var picture = pictureList[i];
      //console.log(picture.toJSON())
      //console.log(picture.thumnail)
      //console.log(picture.picture)
      var thumnailStr = util.bufferToBase64Image(picture.thumnail)
      var pictureStr = util.bufferToBase64Image(picture.picture)
      //console.log(imgStr)
      picture = pictureList[i].toJSON()
      // picture.thumnail = util.bufferToBase64Image(picture.thumnail);
      picture.thumnail = thumnailStr
      picture.picture = pictureStr

      pictureList[i] = picture
      //picture.set({thumnail: })
      //console.log(picture.thumnail)
      //console.log(picture.picture)
      //console.log(picture.thumnail)
      //console.log(picture.thumnail)
    }
  }
  */
  console.log(postList);
  if (!postList) return res.json(util.successFalse('error occured!'));
  res.json(util.successTrue(postList));
});


router.get('/:id', function(req, res) {
  console.log('GET /api/board/:id')
  var boardID = req.params.id;
  Board.findById(boardID)
  .exec(function(err, board) {
    if (err || !board) return res.json(util.successFalse(err));
    else {
      console.log(board.boardProfile)
      
      /** 
      var imageStr = util.bufferToBase64Image(board.boardProfile);
      //console.log(data)
      console.log(imageStr)
      board = board.toJSON();
      board.boardProfile = imageStr;
      //board.set({boardProfile: imageStr})
      */
      console.log(board);
      return res.json(util.successTrue(board));
      //res.json(board);
    }
  }); // Board.findById
});


// 게시물 조회
router.get('/:id/post', async function(req, res) {
  console.log('GET /api/board/:id/post')
  //var memberID = req.decoded._id;
  var memberID = req.decoded._objID;
  var boardID = req.params.id;

  var readPermission = await permission.checkRead(boardID, memberID);
  console.log(readPermission);

  if (readPermission === 0) return res.json(util.successFalse("can't read"));

  // return res.json('temp');
  // readPermission = [1];
  var postList = null;

  // 사진 geo, 포스트 geo 나누어서 찾은 후 이어주면 될거 같음.

  console.log('just view post list');
  postList = await (Post.find({postedBoardID: boardID, visibility: {"$in":readPermission}})
  .populate({ path: 'postWriterID', select: 'memberName'})
  .populate({ path: 'pictureList', select: 'picture'})
  .then( (posts) => {
    return posts;
  })
  .catch( (err) => {
    console.log(err);
    return null;
  }));

  //console.log(postList)
  //postList = postList.toJSON();
  /** 
  for (var i = 0; i < postList.length; ++i) {
    //console.log(postList[i].pictureList);
    var pictureList = postList[i].pictureList;
    //postList[i].pictureList = pictureList
    for (var j = 0; j < pictureList.length; ++j) {
      var picture = pictureList[i];
      //console.log(picture.toJSON())
      //console.log(picture.thumnail)
      //console.log(picture.picture)
      var thumnailStr = util.bufferToBase64Image(picture.thumnail)
      var pictureStr = util.bufferToBase64Image(picture.picture)
      //console.log(imgStr)
      picture = pictureList[i].toJSON()
      // picture.thumnail = util.bufferToBase64Image(picture.thumnail);
      picture.thumnail = thumnailStr
      picture.picture = pictureStr

      pictureList[i] = picture
      //picture.set({thumnail: })
      //console.log(picture.thumnail)
      //console.log(picture.picture)
      //console.log(picture.thumnail)
      //console.log(picture.thumnail)
    }
  }
  */
  console.log(postList);
  if (!postList) return res.json(util.successFalse('error occured!'));
  res.json(util.successTrue(postList));
});


// 게시물 지도 조회
router.get('/:id/map', async function(req, res) {
  console.log('GET /api/board/:id/map')
  //var memberID = req.decoded._id;
  var memberID = req.decoded._objID;
  var boardID = req.params.id;

  var readPermission = await permission.checkRead(boardID, memberID);
  console.log(readPermission);

  if (readPermission === 0) return res.json(util.successFalse("can't read"));

  // return res.json('temp');
  // readPermission = [1];
  var postList = null;
  if (req.query.lat && req.query.long) {
    console.log('in lat long query');
    
    /*
    postList = await (Post.find({postedBoardID: boardID, visibility: {"$in":readPermission}})
    .populate({ path: 'postWriterID', select: 'memberName'})
    .populate({ path: 'pictureList', select: ['thumnail', 'geo']})
    .find({ $or: [{'geo': {
      $near: [
        req.query.lat,
        req.query.long
      ],
      $maxDistance: 1000
      }}, {'pictureList.geo': {
        $near: [
          req.query.lat,
          req.query.long
        ],
        $maxDistance: 1000
        }}
      ]
    })
    .then( (posts) => {
      return posts;
    })
    .catch( (err) => {
      console.log(err);
      return null;
    }));
    */
    postList = await (Post.find({postedBoardID: boardID, visibility: {"$in":readPermission}})
    .populate({ path: 'postWriterID', select: 'memberName'})
    .populate({ path: 'pictureList', select: ['thumbnail', 'geo']})
    .find({'geo': {
      $near: [
        req.query.lat,
        req.query.long
      ],
      $maxDistance: 5 / 111.12 
    }
    })
    .then( (posts) => {
      return posts;
    })
    .catch( (err) => {
      console.log(err);
      return null;
    }));

    // 사진의 위치 정보가 범위에 있을 경우 
    var pictureList = await (Post.find({postedBoardID: boardID, visibility: {"$in":readPermission}})
    .populate({ path: 'postWriterID', select: 'memberName'})
    .populate({
      path: 'pictureList',
      select: ['thumbnail', 'geo'],
      match: {
        'geo': {
          $near: [
            req.query.lat,
            req.query.long
          ],
          $maxDistance: 5 / 111.12 
        }
      }
    })
    .then( (posts) => {
      console.log('in filter');
      return posts.filter(function(post) {
        console.log(post);
        return post.pictureList.length > 0; // populate시 match된 picture가 하나라도 있을시
      })
      //return posts;
    })
    .catch( (err) => {
      console.log(err);
      return null;
    }));

    //console.log(pictureList);
    //console.log('뀨');
    //console.log(pictureList.length);
    //console.log(pictureList[0].pictureList);
    postList = postList.concat(pictureList);
    console.log(postList.length);
  }
  else {
    postList = await (Post.find({postedBoardID: boardID, visibility: {"$in":readPermission}})
    .select(['geo', 'pictureList', 'tagList'])
    .populate({ path: 'pictureList', select: ['thumbnail', 'geo']}) // modify for geo data
    .then( (posts) => {
      return posts;
    })
    .catch( (err) => {
      console.log(err);
      return null;
    }));
  }
  //console.log(postList)
  //postList = postList.toJSON();
  /** 
  for (var i = 0; i < postList.length; ++i) {
    //console.log(postList[i].pictureList);
    var pictureList = postList[i].pictureList;
    //postList[i].pictureList = pictureList
    for (var j = 0; j < pictureList.length; ++j) {
      var picture = pictureList[i];
      //console.log(picture.toJSON())
      //console.log(picture.thumnail)
      //console.log(picture.picture)
      var thumnailStr = util.bufferToBase64Image(picture.thumnail)
      var pictureStr = util.bufferToBase64Image(picture.picture)
      //console.log(imgStr)
      picture = pictureList[i].toJSON()
      // picture.thumnail = util.bufferToBase64Image(picture.thumnail);
      picture.thumnail = thumnailStr
      picture.picture = pictureStr

      pictureList[i] = picture
      //picture.set({thumnail: })
      //console.log(picture.thumnail)
      //console.log(picture.picture)
      //console.log(picture.thumnail)
      //console.log(picture.thumnail)
    }
  }
  */
  console.log(postList);
  if (!postList) return res.json(util.successFalse('error occured!'));
  res.json(util.successTrue(postList));
});

// 게시물 등록
router.post('/:id/post', upload.array('photos[]'), async function(req, res, next){ // board에 글쓰기
  console.log('POST /api/board/:id/post');
  //const transaction = new Transaction()
  var boardID = req.params.id;
  // var memberID = req.decoded._id;
  var memberID = req.decoded._objID;
  var tagList;

  var contents = req.body.contents;
  var visibility = req.body.visibility;

  var tagInfoList = [];
  var pictureInfoList = [];
  var pictureIDList = [];
  var videoLinkList = []

  var postInfo = {};

  var makeTag = function(tagName) {
    return Tag.findOne({tag_name:tagName})
    .then( (tag) => {
      if (!tag) {
        var tagInfo = {
          tagName: tagName
        };
        //console.log(tagInfo);
        return tagInfo;
      }
    })
    .catch( (err) => {
      return null;
    });
  }

  var writePermission = await permission.checkWrite(boardID, memberID);

  if (writePermission === 0) return res.json(util.successFalse("have not permission!"));
  else if (writePermission === 1) visibility = 0; // 그룹 게시판일 경우 전체 공개로만 글을 작성 가능

  if (req.body.tag)
    tagList = req.body.tag.split(',');
  else
    tagList = [];

  for (var i = 0; i < tagList.length; ++i) {
    var tagInfo = await makeTag(tagList[i]);
    //console.log(tagInfo);
    
    if (tagInfo)
      tagInfoList.push(tagInfo);
  }
  
  for (var i = 0; i < req.files.length; ++i) {
    var file = req.files[i];

    var dir = file.destination;
    var resourcedir = dir.substr(dir.indexOf('/') + 1);
    var filename = file.filename;
    var mimetype = file.mimetype;
    var resourceFilepath = resourcedir + '/' + filename; // React에서 불러올 이미지 파일 경로

    if (util.isImage(mimetype)) {
      var items = filename.split('.');
      var fileprefix = items[0]; // 확장자명을 제외한 파일이름
      var extension = items[1]; // jpg or png
      
      var thumbnailPrefix = items[0] + '_thumbnail'
      var thumbnailFileName = thumbnailPrefix + '.' + extension;  // 썸네일 파일명
      var thumbnailFilePath = dir + '/' + thumbnailFileName;
  
      var filepath = dir + '/' + filename;  // 파일이 저장된 경로
      var resourceThumbnailPath = resourcedir + '/' + thumbnailFileName;
      console.log(resourceThumbnailPath);
      var pictureInfo = {};
      pictureIDList.push(new mongoose.Types.ObjectId());

      pictureInfo.picture = resourceFilepath;

      var exif = await (new Promise((resolve, reject) => { // await를 통해 promise가 return할때 까지 기다림
          new ExifImage({image:filepath}, function(err, exifData) { // image의 metadata를 읽는다. 휴대폰에서 촬영한 사진을 컴퓨터로 옮겼을 때 exif 데이터가 사라짐...
            if (err) {
              //console.log(err);
              return reject(err);
            }
            else {
              console.log(exifData);
              return resolve(exifData);
            }
          })
      })).then((exifData) => {
        return exifData;
      }).catch((error) => {
        console.log(error);
        return null;
      });

      //console.log(image);
      //console.log(exif);
      if (exif)
        if (Object.keys(exif.gps).length != 0)
        {
          var gpsLatRef = exif.gps.GPSLatitudeRef;
          var gpsLatDMS = exif.gps.GPSLatitude;
          var gpsLongRef = exif.gps.GPSLongitudeRef;
          var gpsLongDMS = exif.gps.GPSLongitude;

          var lat = util.ConvertDMSToDD(gpsLatDMS[0], gpsLatDMS[1], gpsLatDMS[2], gpsLatRef);
          var long = util.ConvertDMSToDD(gpsLongDMS[0], gpsLongDMS[1], gpsLongDMS[2], gpsLongRef);

          // pictureInfo.pictureLocation = {isExisted:true, lat:lat, long:long};
          pictureInfo.geo = [lat, long]; // modify for geo data
        }

      var image = await jimp.read(filepath);
      image.resize(50, 50).write(thumbnailFilePath); // resize image file and save
      
      /** 
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

      pictureInfo.thumbnail = resourceThumbnailPath;
      pictureInfo._id = pictureIDList[i];


      pictureInfoList.push(pictureInfo);
    }
    else if (util.isVideo(mimetype)) {
      //var dir = file.destination;
      //var filename = file.filename;

      videoLinkList.push(resourceFilepath)
    }
  }

  postInfo.postedBoardID = boardID;
  postInfo.postWriterID = memberID;
  postInfo.postContents = contents;
  postInfo.visibility = visibility;
  postInfo.pictureList = pictureIDList;
  postInfo.videoLinkList = videoLinkList;
  postInfo.tagList = tagList;
  postInfo.postTime = new Date();
  console.log(videoLinkList);
  //console.log(postInfo);
  
  
  const transaction = new Transaction();
  try {
    for (var i = 0; i < tagInfoList.length; ++i) {
      transaction.insert('tag', tagInfoList[i]);
    }
    for (var i = 0; i < pictureInfoList.length; ++i) {
      transaction.insert('picture', pictureInfoList[i]);
    }
    const postID = transaction.insert('post', postInfo);

    const final = await transaction.run()
    console.log('done');
    return res.json(util.successTrue(postID));

  } catch(err) {
    console.log(err);
    await transaction.rollback().catch(console.error)
    transaction.clean();

    return res.json(util.successFalse('error occured!'));
  }
  
  //res.json('temp');

  /*
  Board.findById(boardID)
  .exec(function (err, board) {
    if (err || !board) return res.json(util.successFalse(err));
    else {
      //console.log(req.files)
      var postInfo = {};
      postInfo.posted_board_id = boardID;
      postInfo.post_writer_id = memberID;

      var pictureIDList = [];
      for (var i = 0; i < req.files.length; ++i)
      {
        pictureIDList.push(new mongoose.Types.ObjectId());
        //console.log(pictureIDList[i]);
      }
      postInfo.picture_list = pictureIDList;
      postInfo.comment_list = [];
      postInfo.contents = contents;
      postInfo.visibility = visibility;
      postInfo.tag_list = tagList;
      
      console.log(pictureIDList);
    
      for (var i = 0; i < req.files.length; ++i)
      {
          var file = req.files[0];
          var pictureInfo = {};
          pictureInfo.picture = file.buffer;
          pictureInfo._id = pictureIDList[i];

          jimp.read(file.buffer)
          .then((image) => {
            image.resize(50, 50).getBuffer(file.mimetype, function(err, buffer) {
              pictureInfo.thumnail = buffer;
              var picture = new Picture(pictureInfo);
              //picture.set({_id:pictureIDList[i]});
              //console.log(pictureIDList[i]); // promise 밖의 변수는 접근이 불가라서 undefined라고 보여짐
              console.log(picture)
            });
          });
          //console.log(pictureInfo)
          //console.log(image)
      }

      console.log(postInfo);
      return res.json(util.successTrue('success'));
    }
  }); // Board.findById
   */
});

// 상세 게시물 조회
router.get('/:id/post/:post_id', async function(req, res) {
  console.log('GET /board/:id/post/:post_id');
  //var memberID = req.decoded._id;
  var memberID = req.decoded._objID;
  var boardID = req.params.id;
  var postID = req.params.post_id;

  var readPermission = await permission.checkRead(boardID, memberID);
  console.log(readPermission);

  if (readPermission === 0) return res.json(util.successFalse("can't read"));

  // return res.json('temp');
  // readPermission = [1];

  var post = await (Post.findOne({postedBoardID: boardID, _id:postID, visibility: {"$in":readPermission}})
  .populate({ path: 'postWriterID', select: 'memberName'})
  .populate({ path: 'pictureList', select: ['picture', 'geo']})
  .then( async (post) => {
    
    post.numOfVisitor = post.numOfVisitor + 1
    post = await(post.save()
    .then( (post) => {
      return post;
    })
    .catch((err) => {
      return null;
    }));

    var pick = await(Pick.findOne({memberID:memberID, postID:postID})
    .then( pick => {
      if (pick) return pick;
      else return null;
    })
    .catch( err => {
      return null;
    }));

    postJSON = post.toJSON();
    console.log(postJSON)
    postJSON.commentListLength = postJSON.commentList.length;
    if (pick) {
      postJSON.pick = true;
    }
    else {
      postJSON.pick = false;
    }

    //postJSON.commentList = postJSON.commentList.length;
    return postJSON;
  })
  .catch( (err) => {
    console.log(err);
    return null;
  }));

  if (!post) return res.json(util.successFalse('error occured!'));
  else return res.json(util.successTrue(post));
});


// 상세 게시물 수정
router.put('/:id/post/:post_id', async function(req, res) {
  console.log('UPDATE /board/:id/post/:post_id');
  //var memberID = req.decoded._id;
  var memberID = req.decoded._objID;
  var boardID = req.params.id;
  var postID = req.params.post_id;

  var post = await(Post.findOne({_id: postID})
  .then( (post) => {
    return post;
  })
  .catch( (err) => {
    return null;
  }));

  if (!post) {
    return res.json(util.successFalse('post does not exist!'));
  } 
  else if(!post.postWriterID.equals(memberID)) {
    console.log('member can not modify post..');
    return res.json(util.successFalse('member can not modify post!'));
  }
  //console.log(readPermission);

  var post = await (Post.findOneAndUpdate({_id: postID, postWriterID: memberID}, req.body, {new: true}).populate('pictureList')
  .then( (post) => {
    postJSON = post.toJSON();
    //console.log(postJSON)
    postJSON.commentListLength = postJSON.commentList.length; // 게시물 댓글 길이를 추가
    delete postJSON.commentList
    //postJSON.commentList = postJSON.commentList.length;
    return postJSON;
  })
  .catch( (err) => {
    console.log(err);
    return null;
  }));

  if (!post) {
    return res.send(util.successFalse('can not found post!'));
  } else {
    return res.send(util.successTrue(post)); // 수정된 게시물 반환
  }
});



// 상세 게시물 댓글 조회
router.get('/:id/post/:post_id/comment', async function(req, res) {
  console.log('GET /board/:id/post/:post_id');
  //var memberID = req.decoded._id;
  var memberID = req.decoded._objID;
  var boardID = req.params.id;
  var postID = req.params.post_id;

  var readPermission = await permission.checkRead(boardID, memberID);
  console.log(readPermission);

  if (readPermission === 0) return res.json(util.successFalse("can't read"));

  // return res.json('temp');
  // readPermission = [1];
  /*
  var postList = await (Post.findOne({postedBoardID: boardID, _id:postID, visibility: {"$in":readPermission}})
  .populate('pictureList').populate('commentList')
  .then( (posts) => {
    return posts;
  })
  .catch( (err) => {
    console.log(err);
    return null;
  }));
*/
  var commentList = await postQuery.getCommentList(postID);

  if (!commentList) return res.json(util.successFalse('error occured!'));
  else return res.json(util.successTrue(commentList));
});

// 댓글 등록
router.post('/:id/post/:post_id/comment', async function(req, res) {
  console.log('POST /board/:id/post/:post_id/comment');
  //var memberID = req.decoded._id;
  var memberID = req.decoded._objID;
  var boardID = req.params.id;
  var postID = req.params.post_id;
  console.log(boardID);
  console.log(postID);
  var comment = req.body.comment;

  var writeCommentPermission = await permission.checkWriteComment(boardID, postID, memberID);
  console.log(writeCommentPermission);

  if (writeCommentPermission === 0) return res.json(util.successFalse("can't write comment!")); // 댓글 작성 권한이 없을 시 에러

  // return res.json('temp');
  // readPermission = [1];
  console.log(comment);
  var post = await postQuery.getPost(postID);
  //var commentInfo = {
  //  commentContents: comment
  //};

  var newComment = new Comment({
    commentWriterID: memberID,
    commentContents: comment,
    commentTime: new Date()
  });

  try {
    var newComment = await newComment.save();
    console.log(newComment._id);
    post.commentList.push(newComment._id);
    var updatePost = await post.save();

    /*
    var populatePost = updatePost.populate('pictureList', 'commentList').populate('commentWriterID')
    .exec(function(err, post) {
      if (err) return res.json(util.successFalse('populate error occured!'));
      return res.json(util.successTrue(post));
    });
    */
    var commentList = await postQuery.getCommentList(postID);

    if (!commentList) return res.json(util.successFalse('error occured!'));
    else return res.json(util.successTrue(commentList));

    //return res.json(util.successTrue());

  } catch (err) {
    return res.json(util.successFalse('error occured!'))
  }
  //var commentList = post.commentList

  //console.log(commentList);
  //console.log(typeof(commentList));

  //return res.json(util.successTrue('done'));

  /**  Entity Not Found Exception!
  var transaction = new Transaction();
  
  try {
    var commentObjID = transaction.insert('comment', commentInfo);
    console.log(commentObjID);
    transaction.update('post', post._id, {'$push': {commentList : commentObjID}} );

    const final = await transaction.run()

    return res.json(util.successTrue(postID));

  } catch(err) {
    await transaction.rollback().catch(console.error)
    transaction.clean();

    return res.json(util.successFalse('error occured!'));
  }
  */
});

// 상세 게시물 좋아요
router.post('/:id/post/:post_id/pick', async function(req, res) {
  console.log('POST /board/:id/post/:post_id/pick');
  //var memberID = req.decoded._id;
  var memberID = req.decoded._objID;
  var boardID = req.params.id;
  var postID = req.params.post_id;

  var readPermission = await permission.checkRead(boardID, memberID);
  console.log(readPermission);

  if (readPermission === 0) return res.json(util.successFalse("can't read"));

  var pick = await(Pick.findOne({memberID:memberID, postID:postID})
  .then( pick => {
    if (pick) return pick;
    else return null;
  })
  .catch( err => {
    return null;
  }));

  // 이미 게시물 픽(좋아요)을 눌렀을 경우
  if (pick) return res.json(util.successFalse("already pick!"));

  // return res.json('temp');
  // readPermission = [1];

  var numOfLike = await (Post.findOne({_id:postID})
  .then( async (post) => {
    
    post.numOfLike = post.numOfLike + 1
    var numOfLike = post.numOfLike;
    post = await(post.save()
    .then( (post) => {
      return post;
    })
    .catch((err) => {
      return null;
    }));
    console.log(post);

    var pick = new Pick({memberID: memberID, postID: postID});
    pick.save()
    .then( pick => {
      console.log(pick)
    })
    .catch( err => {
      console.log(err);
    });

    //postJSON.commentList = postJSON.commentList.length;
    console.log(numOfLike);
    return numOfLike;
  })
  .catch( (err) => {
    console.log(err);
    return null;
  }));

  if (!numOfLike) return res.json(util.successFalse('error occured!'));
  else return res.json(util.successTrue(numOfLike));
});

// 상세 게시물 좋아요 취소
router.delete('/:id/post/:post_id/pick', async function(req, res) {
  console.log('DELETE /board/:id/post/:post_id/pick');
  //var memberID = req.decoded._id;
  var memberID = req.decoded._objID;
  var boardID = req.params.id;
  var postID = req.params.post_id;

  var pick = await(Pick.remove({memberID:memberID, postID:postID})
  .then( pick => {
    console.log('remove done!');
    console.log(pick);
    if (pick) return pick;
    else return null;
  })
  .catch( err => {
    return null;
  }));

  // 삭제된 경우
  if (!pick) return res.json(util.successFalse("not pick!"));

  // return res.json('temp');
  // readPermission = [1];

  var numOfLike = await (Post.findOne({_id:postID})
  .then( async (post) => {
    
    post.numOfLike = post.numOfLike - 1;
    var numOfLike = post.numOfLike;
    post = await(post.save()
    .then( (post) => {
      return post;
    })
    .catch((err) => {
      return null;
    }));
    console.log(post);

    if (!post) return null;
    
    //postJSON.commentList = postJSON.commentList.length;
    console.log(numOfLike);
    return numOfLike;
  })
  .catch( (err) => {
    console.log(err);
    return null;
  }));

  console.log('in delete');
  console.log(numOfLike);
  // if (!numOfLike) numOfLike가 0일 경우 true가 된다. 
  if (numOfLike === null) return res.json(util.successFalse('error occured!'));
  else return res.json(util.successTrue(numOfLike));
});

// -------------------------- 그룹 멤버 관련 -------------------------------

// 회원 초대
router.post('/:id/invitation', async function(req, res) {
  var memberObjID = req.decoded._objID;
  var boardID = req.params.id;
  var inviteMemberID = req.body.inviteMember;
  //console.log(inviteMemberID);

  if (memberObjID == inviteMemberID) {
    return res.json(util.successFalse('you can not invite yourself!'));
  }

  var isExisted = await memberQuery.isExisted(inviteMemberID);
  console.log(isExisted);
  if (!isExisted) return res.json(util.successFalse('member does not exist!'));

  var isJoined = await partyQuery.isJoined(boardID, inviteMemberID);
  if (isJoined) return res.json(util.successFalse('member already joined'))

  var invitePermission = await permission.checkInvite(boardID, memberObjID);

  console.log(invitePermission);

  if (invitePermission) {
    var newMessage = new Message({
      catcherID: inviteMemberID,
      senderID: memberObjID,
      messageKind: 1,
      inviteBoardID: boardID
    });
    newMessage.save()
    .then( (savedMessage) => {
      return res.json(util.successTrue('done'));
    })
    .catch( (err) => {
      return res.json(util.successFalse('error occured!'));
    });
  }
  else {
    return res.json(util.successFalse('have not invitePermisstion!'));
  }
});

// 초대 가능 회원 목록 조회
router.get('/:id/invitation', async function(req, res) {
  var memberObjID = req.decoded._objID;
  var boardID = req.params.id;
  //console.log(inviteMemberID);

  var boardMemberIDList = [];  // boardMember의 id를 저장할 배열
  var boardMemberList = await partyQuery.getBoardMemberList(boardID);
  for (var i = 0; i < boardMemberList.length; ++i) {
    boardMemberIDList.push(boardMemberList[i].boardMemberID);
  }
  
  //console.log(boardMemberList);
  
  //for (var i = 0; i < boardMemberList.length; ++i) {
  //  friendIDList.push(mutualFriendList[i].requestedMemberID._id);
  //}

  
  var mutualFriendList = await friendQuery.getMutualFriendListWithoutBoardMember(memberObjID, boardMemberIDList);
  //if (mutualFriendList.length === 0) return res.json(util.successFalse('multual friend does not exist!'));
  //console.log(mutualFriendList);

  //var mutualFriendList2 = await friendQuery.getMutualFriendList(memberObjID);
  //console.log(mutualFriendList2);
  //var friendIDList = [];
  //for (var i = 0; i < mutualFriendList.length; ++i) {
  //  friendIDList.push(mutualFriendList[i].requestedMemberID._id);
  //}

  var invitePermission = await permission.checkInvite(boardID, memberObjID); // 초대할 수 있는지 권한 확인
  //console.log(invitePermission);
  //console.log(invitePermission);

  if (invitePermission) {
    return res.json(util.successTrue(mutualFriendList));
  }
  else {
    return res.json(util.successFalse('have not invitePermisstion!'));
  }
});


// 그룹 권한 여부(가입 여부, 글쓰기 여부)
router.get('/:id/member/me', async function(req, res) {
  var memberObjID = req.decoded._objID;
  var boardID = req.params.id;
  //console.log(inviteMemberID);

  //var isJoined = await partyQuery.isJoined(boardID, memberObjID);

  Party.findOne({boardID: boardID, boardMemberID: memberObjID})
  .then( (party) => {
    var result = {}
    if (party) {
      result.isJoined = 'true';
      if (party.writeAuth) {
        result.writeAuth = 'true';
      }
      else {
        result.writeAuth = 'false';
      }
    }
    else {
      result.isJoined = 'false'
      result.writeAuth = 'false'
    }
    return res.json(util.successTrue(result));
  })
  .catch( (err) => {
    return res.json(util.successFalse('error occured!'));
  })
  //return res.json(util.successTrue(isJoined.toString()));
});


// 그룹 가입
router.post('/:id/member/me', async function(req, res) {
  console.log('POST /board/:id/member/me');
  var memberObjID = req.decoded._objID;
  var boardID = req.params.id;
  //console.log(inviteMemberID);

  var board = await boardQuery.getBoard(boardID);
  console.log(board);
  console.log(board.boardKind);

  if (board.boardKind != 0) {
    return res.json(util.successFalse('Can not join this board!'))
  }

  var isJoined = await partyQuery.isJoined(boardID, memberObjID);
  if (isJoined) {
    return res.json(util.successFalse('Already Joined!'))
  }

  console.log(isJoined);
  var newParty = new Party({
    writeAuth: board.canImmediateWrite,
    boardID: boardID,
    boardMemberID: memberObjID
  });

  /*
  newParty.save()
  .exec( (err, party) => {
    if (err) return res.json(util.successFalse('error occured!'));
    else return res.json(util.successTrue('done'));
  });
  */

  var result = {
    writeAuth: board.canImmediateWrite
  };
  
  newParty.save()
  .then( (result) => {
    return res.json(util.successTrue(result)); // 글 작성 여부 반환
  })
  .catch( (err) => {
    return res.json(util.successFalse('error occured!'));
  })
});

// 그룹 탈퇴
router.delete('/:id/member/me', async function(req, res) {
  console.log('POST /board/:id/member/me');
  var memberObjID = req.decoded._objID;
  var boardID = req.params.id;
  //console.log(inviteMemberID);

  Party.find({boardID: boardID, boardMemberID:memberObjID})
  .remove()
  .then( (result) => {
    if (result) {
      return res.json(util.successTrue('done'))
    }
    else {
      return res.json(util.successFalse('does not exist!'));
    }
  })
  .catch( (err) => {
    console.log(err);
    return res.json(util.successFalse('error occured!'));
  })
});


// 그룹 회원 조회
router.get('/:id/member', async function(req, res) {
  console.log('GET /board/:id/member')
  var memberObjID = req.decoded._objID;
  var boardID = req.params.id;
  //console.log(inviteMemberID);

  var partyList = await partyQuery.getBoardMemberListWithMemberInfo(boardID);

  if (partyList) {
    return res.json(util.successTrue(partyList));
  }
  else {
    return res.json(util.successFalse('member do not exist!'))
  }
});


module.exports = router;

/*
 GET /board?name='게시판 이름' => 게시판 검색
 POST /board => 게시판 생성(그룹 생성)
 GET /board/me => 나의 게시판 목록 조회(내 그룹 조회)
 GET /board/:id => 게시판 정보
 GET /board/:id/post => 게시물 조회
 GET /board/:id/map => 게시물 위치 정보 조회
 POST /board/:id/post => 글 작성
 GET /board/:id/post/:post_id => 상세 게시물 조회
 PUT /board/:id/post/:post_id => 상세 게시물 수정
 GET /board/:id/post/:post_id/comment => 댓글 조회
 POST /board/:id/post/:post_id/comment => 댓글 작성

 next:
 POST /board/:id/member/invitation => 회원 초대
 GET /board/:id/member/invitation => 회원 초대 가능 목록
 POST /board/:id/member/me => 회원 가입    (미완)
 DELETE /board/:id/member/me => 회원 탈퇴  (미완)
 GET /board:id/member => 회원 목록         (미완)
*/

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var multer = require('multer');
var jimp = require('jimp');
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
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });

router.use(util.isLoggedin);

router.get('/', async function(req, res) {
  console.log('GET /api/board?name=')
  if (req.query.name) {
    Board.find({boardName: { "$regex": req.query.name, "$options": "i" }, boardKind: 0}) // 공개 그룹 중 name을 포함하는 게시판 검색
    .then( (boards) => {
      console.log(boards);
      return res.json(util.successTrue(boards));
    })
    .catch( (err) => {
      console.log(err);
      return res.json(util.successTrue(err));
    });
  }
});

router.post('/', upload.single('boardProfile'), async function(req, res) {
  console.log('POST /api/board')
  console.log(req.body)
  var memberObjID = req.decoded._objID; 
  var boardName = req.body.boardName;
  var boardKind = req.body.isOpen == 'true' ? 0 : 1;  // 공개, 비공개
  var managerID = memberObjID;
  var canImmediateWrite = req.body.canImmediateWrite == 'true' ? true : false;  // React에서 boolean 값을 줄 경우 문자열로 줌

  console.log(canImmediateWrite)

  var memberList = req.body.memberList;
  
  if (!req.file) {
    return res.json(util.successFalse('error occured!'));
  }

  var image = await jimp.read(req.file.buffer);
  var boardProfile = await (new Promise((resolve, reject) => { // await를 통해 promise가 return할때 까지 기다림
    image.resize(50, 50).getBuffer(req.file.mimetype, (error, buf) => {
      return error ? reject(error) : resolve(buf);
    });
  })).then((buf) => {
    return buf;
  }).catch((error) => {
    return null;
  });

  if (!boardProfile) {
    return res.json(util.successFalse('error occured!'));
  }
  
  var boardInfo = {
    // _id : new ObjectId() // it will be update at tranaction insert, _id값을 넣어도 transaction insert때 _id가 새로 발급된다.
    boardName: boardName,
    boardKind: boardKind,
    boardProfile: boardProfile,
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
  for (var i = 0; i < memberList.length; ++i) {
    messageInfo = {
      catcherID: memberList[i],
      senderID: memberObjID,
      messageKind: 1,
    }
    messageInfoList.push(messageInfo);
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

router.get('/me', function(req, res) { // 게시판 조회(그룹 조회), 개인 게시판은 populate에서 제외되서 null값
  console.log('GET /api/board/me');

  var memberID = req.decoded._objID;

  Party.find({boardMemberID: memberID}).select('boardID')
  .populate({
    path:'boardID',
    match: {
      boardKind : {"$in":[0, 1]} // 개인 게시판 2는 제외. 공개 그룹(0), 비공개 그룹(1)만 검색 
    }
  }) //.find({'boardID.boardKind': {"$in":[0, 1, 2]}})
  .then( (parties) => {
    //console.log(parties);
    console.log(parties);
    return res.json(util.successTrue(parties));
  })
  .catch( (err) => {
    console.log(err);
    return res.json(util.successFalse('error occured!'));
  })
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
  var postList = await (Post.find({postedBoardID: boardID, visibility: {"$in":readPermission}})
  .populate({ path: 'postWriterID', select: 'memberName'})
  .populate({ path: 'pictureList', select: 'thumnail'})
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
  var postList = await (Post.find({postedBoardID: boardID, visibility: {"$in":readPermission}})
  .select(['postLocation', 'pictureList', 'tagList'])
  .populate({ path: 'pictureList', select: ['thumnail', 'pictureLocation']})
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

  var postInfo = {};

  /*
  var board = await (Board.findById(boardID)
  .then( (board) => {
    if (board) {
      return board;
    }
    else {
      return null;
    }
  })
  .catch( (err) => {
    return null;
  }));
  
  if (!board) return res.json(util.successFalse("can't not find board!"));

  var party = await (Party.findOne({board_id:boardID, board_member_id:memberID})
  .then((party) => {
    if (party) {
      return party;
    }
    else {
      return null;
    }
  })
  .catch( (err) => {
    return null;
  }));
  
  if (!party || !party.write_auth) return res.json(util.successFalse("can't write"));
  */
  var writePermission = await permission.checkWrite(boardID, memberID);
  console.log(writePermission);
  if (writePermission === 0) return res.json(util.successFalse("error occured!"));
  else if (writePermission === 1) visibility = 0; // 그룹 게시판일 경우 전체 공개로만 글을 작성 가능

  if (req.body.tag)
    tagList = req.body.tag.split(',');
  else
    tagList = [];

  for (var i = 0; i < tagList.length; ++i) {
    /*
    (function(tagName) {
      Tag.findOne({tag_name:tagName})
      .exec (function(err, tag) {
        if (err || !tag) {
          
          var tag = new Tag({
            tag_name:tagName
          });
          
          
          //transaction.insert('tag', {tag_name:tagName});
          //tag.save(function(err, tag) {
          //});
          //tag.save(function(err, tag) {});
        }
        console.log(tag);
      });
    })(tagList[i]);
    */
    const makeTag = function(tagName) {
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
    var tagInfo = await makeTag(tagList[i]);
    //console.log(tagInfo);
    
    if (tagInfo)
      tagInfoList.push(tagInfo);
  }

  for (var i = 0; i < req.files.length; ++i)
    pictureIDList.push(new mongoose.Types.ObjectId())

  for (var i = 0; i < req.files.length; ++i) {
    var file = req.files[i];
    var pictureInfo = {};
    pictureInfo.picture = file.buffer;

    var exif = await (new Promise((resolve, reject) => { // await를 통해 promise가 return할때 까지 기다림
        new ExifImage({image:file.buffer}, function(err, exifData) { // image의 metadata를 읽는다. 휴대폰에서 촬영한 사진을 컴퓨터로 옮겼을 때 exif 데이터가 사라짐...
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

        pictureInfo.pictureLocation = {isExisted:true, lat:lat, long:long};
      }

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

    pictureInfo.thumnail = thumnailBuffer;
    pictureInfo._id = pictureIDList[i];
    //var resize = await image.resize(50, 50).getBuffer(file.mimetype);
    //console.log(file.buffer);
    //console.log(thumnailBuffer);
    /*
    var makeThumnail = () => {
      return jimp.read(file.buffer)
      .then( (image) => {
        return image.resize(50, 50).getBuffer(file.mimetype)
        .then( (buffer) => {
          return buffer;
          console.log(buffer);
        })
        .catch( (err) => {
          return null;
        });
      })
      .catch( (err) => {
        return null;
      });
    }*/
    //console.log(pictureInfo)
    //console.log(image)

    pictureInfoList.push(pictureInfo);
  }

  postInfo.postedBoardID = boardID;
  postInfo.postWriterID = memberID;
  postInfo.postContents = contents;
  postInfo.visibility = visibility;
  postInfo.pictureList = pictureIDList;
  postInfo.tagList = tagList;
  
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

    return res.json(util.successTrue(postID));

  } catch(err) {
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
  .populate({ path: 'pictureList', select: ['picture', 'pictureLocation']})
  .then( (post) => {
    postJSON = post.toJSON();
    //console.log(postJSON)
    postJSON.commentListLength = postJSON.commentList.length;
    delete postJSON.commentList
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

  //console.log(readPermission);

  var post = await (Post.findOneAndUpdate({_id: postID, postWriterID: memberID}, req.body, {new: true}).populate('pictureList')
  .then( (post) => {
    postJSON = post.toJSON();
    //console.log(postJSON)
    postJSON.commentListLength = postJSON.commentList.length;
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
    return res.send(util.successTrue(post));
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

  var comment = req.body.contents;

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
    commentContents: comment
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


// -------------------------- 그룹 멤버 관련 -------------------------------

// 회원 초대
router.post('/:id/member/invitation', async function(req, res) {
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
router.get('/:id/member/invitation', async function(req, res) {
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


// 그룹 가입
router.post('/:id/member/me', async function(req, res) {
  var memberObjID = req.decoded._objID;
  var boardID = req.params.id;
  //console.log(inviteMemberID);

  var board = boardQuery.getBoard(boardID);

  if (board.boardKind != 0) {
    return res.json('Can not join this board!')
  }

  var newParty = new Party({
    writeAuth: board.canImmediateWrite,
    boardID: boardID,
    boardMemberID: memberObjID
  });

  newParty.save()
  .exec( (err, party) => {
    if (err) return res.json('error occured!');
    else return res.json('done');
  });
});



module.exports = router;

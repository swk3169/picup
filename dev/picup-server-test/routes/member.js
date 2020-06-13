/* 
 GET /member?name='회원이름' => 회원 이름 검색
 GET /member/me => 로그인한 회원 정보
 GET /member/:id => 해당 id의 회원 정보
 POST /member => 회원 등록
*/

var express = require('express');
var router = express.Router();
var util = require('../utils');
var multer = require('multer');
var jimp = require('jimp');
var fs = require('fs');

var Member = require('../models/Member');
var Board = require('../models/Board');
var Party = require('../models/Party');
var Friend = require('../models/Friend');

var friendQuery = require('../query/friendQuery');
var memberQuery = require('../query/memberQuery');

var mongoose = require('mongoose');
var Transaction = require('mongoose-transactions');

var async    = require('async')

/** 
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    req.dirname = 'upload/temp';
    callback(null, 'upload/temp');
  },
  filename: function(req, file, callback) {
    var idx = file.originalname.lastIndexOf('.');
    
    var filename = file.fieldname + '-' + Date.now() + file.originalname.substring(idx).toLowerCase();
    req.filename = filename;
    req.mimetype = file.mimetype;

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

router.use(util.isAuthenticated);

router.get('/', util.isLoggedin, async function(req, res) {
  if (req.query.name) {
   console.log('GET /api/member?name=');
   var memberList = await memberQuery.findMemberByName(req.query.name);
   //console.log(memberList);
   //console.log(memberList.length);
   var memberID = req.decoded._objID;
   for (var i = 0; i < memberList.length; ++i) {
     memberList[i] = memberList[i].toJSON();
     //console.log("뀨")
     //console.log(memberList[i]._id);
     //console.log(memberID);
     if (!memberID.equals(memberList[i]._id)) {
       var isFriend = await friendQuery.isFriend(memberID, memberList[i]._id);  // 친구 여부도 함께 반환(미완)
       console.log("뀨");
       memberList[i].me = false;
       memberList[i].isFriend = isFriend;
     }
     else {
       memberList[i].me = true;
       memberList[i].isFriend = false;
     }
   }
   //console.log(memberList);

   return res.json(util.successTrue(memberList));
  }
  else {
    console.log('GET /api/member'); // 회원 목록 조회
    Member.find({})
    .then( (members) => {
      return res.json(util.successTrue(members));
    })
    .catch( (err) => {
      return res.json(util.successTrue(err));
    });
  };
});

router.post('/', upload.single('memberProfile'), async function(req, res, next){
  console.log(req);
  //console.log(req.headers);
  //var token = util.ensureAuthorized(req.headers['authorization']);
  //console.log(token);
  console.log('POST /member');
  console.log(req.decoded._id);

  var memberID = req.decoded._id;
  console.log(memberID);
  var gender = req.body.gender === 'man' ? 0 : 1;
  var email = req.body.email;
  console.log(req.body.birth);
  var birth = new Date(req.body.birth);
  var name = req.body.memberName;
  var file = req.file;

  //req.body['member_id'] = req.decoded._id;
  //req.body['gender'] = req.body['gender'] === 'man' ? 1 : 2;
  var member = await (Member.findOne({memberID: memberID})
  .then( (member) => {
    if (member) return member;
    else return null;
  })
  .catch( (err) => {
    return null;
  }));

  if (member) return res.json(util.successFalse('error occured!'));
  //if (member) return res.json(util.successFalse('member already existed!'));

  if (!req.file) {
    return res.json(util.successFalse('error occured!'));
  }
  
  if (util.isImage(file.mimetype)) {
    var dir = file.destination;
    var resourcedir = dir.substr(dir.indexOf('/') + 1);

    var filename = file.filename;
    var extension = filename.split('.')[1]; // jpg or png
    var newfilename = memberID + '.' + extension; // member id를 profile image의 파일명으로 설정
    var filepath = dir + '/' + filename;  // 파일이 저장된 경로
    var newfilepath = dir + '/' + newfilename;  // 프로필 사진을 새로 저장할 경로
    var resourcefilepath = resourcedir + '/' + newfilename // React에서 불러올 파일 경로

    var image = await jimp.read(filepath);

    image.resize(50, 50).write(newfilepath); // resize image file and save
    fs.unlinkSync(filepath);  // remove original file

    var memberInfo = {
      memberID: memberID,
      memberName: name,
      gender: gender,
      email: email,
      birth: birth,
      memberProfile: resourcefilepath,
    };
  
    var boardInfo = {
      boardName: name,
      boardKind: 2,
      boardProfile: resourcefilepath,
    };

    var partyInfo = {
      writeAuth: true
    }

    // input info to mongodb
    const transaction = new Transaction();
    try {
      var memberObjID = transaction.insert('member', memberInfo);
      //console.log(memberObjID);
      boardInfo.managerID = memberObjID;
      var boardObjID = transaction.insert('board', boardInfo);
      //console.log('done')
      transaction.update('member', memberObjID, {privateBoard:boardObjID});
      //console.log('done')
      partyInfo.boardID = boardObjID;
      partyInfo.boardMemberID = memberObjID;
      transaction.insert('party', partyInfo);
  
      const final = await transaction.run();
  
      console.log('register done');
      return res.json(util.successTrue(memberObjID));
    } catch(err) {
      console.log(err);
      await transaction.rollback().catch(console.error)
      transaction.clean();
  
      return res.json(util.successFalse('error occured!'));
    }
  }

  else {
    return res.json(util.successFalse('profile image must be jpeg or png!'));
  }

  var image = await jimp.read(req.file.buffer);
  var memberProfile = await (new Promise((resolve, reject) => { // await를 통해 promise가 return할때 까지 기다림
    image.resize(50, 50).getBuffer(req.file.mimetype, (error, buf) => {
      return error ? reject(error) : resolve(buf);
    });
  })).then((buf) => {
    return buf;
  }).catch((error) => {
    return null;
  });
  
  var memberInfo = {
    memberID: memberID,
    memberName: name,
    gender: gender,
    email: email,
    birth: birth,
    memberProfile: memberProfile,
  };

  var boardInfo = {
    //_id: new mongoose.Types.ObjectId(),
    boardName: name,
    boardKind: 2,
    boardProfile: memberProfile,
    //member_list:[{member_id: newMember.member_id, write_auth:true}] member가 많이지면 document size(16MB)를 넘어갈 수 도 있으므로 Party로 따로뺌
  };

  var partyInfo = {
    writeAuth: true
  }

  //console.log(memberInfo);

  const transaction = new Transaction();
  try {
    var memberObjID = transaction.insert('member', memberInfo);
    //console.log(memberObjID);
    boardInfo.managerID = memberObjID;
    var boardObjID = transaction.insert('board', boardInfo);
    //console.log('done')
    transaction.update('member', memberObjID, {privateBoard:boardObjID});
    //console.log('done')
    partyInfo.boardID = boardObjID;
    partyInfo.boardMemberID = memberObjID;
    transaction.insert('party', partyInfo);

    const final = await transaction.run();

    console.log('register done');
    return res.json(util.successTrue(memberObjID));
  } catch(err) {
    console.log(err);
    await transaction.rollback().catch(console.error)
    transaction.clean();

    return res.json(util.successFalse('error occured!'));
  }

  //res.json('temp');
  /** 
  Member.findOne({member_id: req.decoded._id})
  .then((member) => {
    if (member) return res.json(util.successFalse('member already exist')); // member가 존재할 경우 회원 가입 불가
    
    var filename = req.dirname + '/' + req.filename;
    // 저장된 파일을 읽어서 로드후 buffer값을 가져온 후 body에 추가
    jimp.read(filename, function(err, lenna) {
      if (err) return res.json(util.successFalse(err));
      else { 
        lenna.resize(50, 50).getBuffer(req.mimetype, function(err, buffer){
          //console.log(buffer);
          req.body['member_profile'] = buffer;
          req.body['_id'] = new mongoose.Types.ObjectId();

          var newMember = new Member(req.body);

          var newBoard = new Board({
            _id: new mongoose.Types.ObjectId(),
            board_name: newMember.member_name,
            board_kind: 2,
            manager_id: newMember.member_id,
            board_profile: newMember.member_profile,
            //member_list:[{member_id: newMember.member_id, write_auth:true}] member가 많이지면 document size(16MB)를 넘어갈 수 도 있으므로 Party로 따로뺌
          });
          
          //newMember.set({board_list: [newBoard._id]})
          
          var newParty = new Party({
            _id: new mongoose.Types.ObjectId(),
            board_id: newBoard._id,
            board_member_id: newMember.member_id,
            write_auth: true
          });

          async.parallel([
            function (callback) {
              newMember.save(callback);
            },
            function (callback) {
              newBoard.save(callback);
            },
            function (callback) {
              newParty.save(callback);
            }
          ],
          function (errs, results) {
            if (errs) {
              async.each(results, function(doc, callback) { // rollback function
                //if (!doc) { callback(); }
                //else {
                  Member.findByIdAndRemove(newMember._id).exec(function(err, doc) {
                  });
                  Board.findByIdAndRemove(newBoard._id).exec(function(err, doc) {
                  });
                  Party.findByIdAndRemove(newParty._id).exec(function(err, doc) {
                  });
                  callback();
                //}
              }, function () {
                console.log('Rollback done.');
              });
              return res.json(util.successFalse(errs));
            } else {
              return res.json(util.successTrue(newMember));
            }
          }); // ebd async.parallel
          //newMember.save(function(err, member) {
          //  return res.json(err || !user ? util.successFalse(err) : util.successTrue(member)); 
          //});
        }); // end lenna resize
      } // succed image open
    }); // end jimp
  }) // end member find then
  .catch((err) => {
    return res.json(util.successFalse(err));
  });
  */
});

router.get('/me', function(req, res) {
  var memberID = req.decoded._id;
  console.log(memberID);
  Member.findOne({memberID:memberID})
  .exec(function(err, member) {
    console.log(member);
    console.log(err);
    if (err || !member) return res.json(util.successFalse(err));
    else {
      return res.json(util.successTrue(member));
    }
  });
});

router.get('/:id', function(req, res) {
  var memberID = req.params.id;
  Member.findById(memberID)
  .exec(function(err, member) {
    if (err || !member) return res.json(util.successFalse(err));
    else {
      return res.json(util.successTrue(member));
    }
  });
});

module.exports = router;

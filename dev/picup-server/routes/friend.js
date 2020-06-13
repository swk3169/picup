/* 
 GET /friend => 내 친구 목록
 GET /friend/:member_id => member_id의 친구 목록
 POST /friend/me/:member_id => member_id를 친구 목록에 추가
 DELETE /friend/me/:member_id => member_id를 친구 목록에서 삭제
 GET /me/recommendation => 친구 추천 (test 필요)
*/

var express = require('express');
var router = express.Router();
var util = require('../utils');

var Member = require('../models/Member');
var Party = require('../models/Party');
var Friend = require('../models/Friend');
var Message = require('../models/Message');

var mongoose = require('mongoose');
var Transaction = require('mongoose-transactions'); 

router.use(util.isLoggedin);

router.get('/', function(req, res) { // member_id가 추가한 친구 조회
  console.log('GET /api/friend');
  var memberID = req.decoded._objID;

  Friend.find({requestMemberID:memberID})
  .select('requstedMemberID')
  .populate('requestedMemberID')
  .then( (friends) => {
    for (var i = 0; i < friends.length; ++i) {
      friends[i] = friends[i].toJSON();
      friends[i].isFriend = 'true';
    }
    
    return res.json(util.successTrue(friends));

  })
  .catch( (err) => {
    //console.log(err);
    return res.json(util.successFalse('error occured!'));
  });
});

router.get('/:member_id', function(req, res) { // member_id가 추가한 친구 조회
  console.log('GET /api/friend/:member_id');
  var memberID = req.params.member_id;

  Friend.find({requestMemberID:memberID})
  .select('requstedMemberID')
  .populate('requestedMemberID')
  .then( (friends) => {
    return res.json(util.successTrue(friends));
  })
  .catch( (err) => {
    //console.log(err);
    return res.json(util.successFalse('error occured!'));
  });
});

router.post('/me', async function(req, res, next){ // member_id에게 친구 요청
  console.log('GET /api/friend/me');
  var requestID = req.decoded._objID;
  //console.log(req.body);
  //var requestedID = mongoose.Types.ObjectId(req.body.requested_member_id);
  var requestedID = req.body.requestedMemberID;
  
  if (requestID == requestedID) {
    return res.json(util.successFalse('can not add me in friend list'))
  }
  
  var member = await (Member.findById(requestedID)
  .then((member) => {
    if (member) return member;
    else return null;
  }) // end member find then
  .catch((err) => {
    return null;
  }));
  
  if (!member) return res.json(util.successFalse('error occured!'));

  var friend = await (Friend.findOne({requestMemberID: requestID, requestedMemberID: requestedID})
  .then( (friend) => {
    if (friend) return friend;
    else return null; 
  })
  .catch( (err) => {
    return null;
  }));
  
  if (friend) return res.json(util.successTrue('done'));

  var friendInfo = {
    requestMemberID:requestID,
    requestedMemberID:requestedID
  };
  var messageInfo = {
    catcherID: requestedID,
    senderID: requestID,
    messageKind: 0
  }
  
  const transaction = new Transaction();

  console.log(friendInfo);

  try {
    transaction.insert('friend', friendInfo);   //  error: Error: Entity not found, friendInfo의 requested_member_id가 undifiend일때 발생
    transaction.insert('message', messageInfo);
    const final = await transaction.run();

    return res.json(util.successTrue('done'));

  } catch (err) {
    await transaction.rollback().catch(console.error)
    transaction.clean();

    return res.json(util.successFalse('error occured!'));
  }
});

router.delete('/me/:member_id', async function(req, res, next){ // 친구 목록 중 member_id를 삭제
  console.log('DELETE /api/friend/me/:member_id');
  var requestID = req.decoded._objID;
  //console.log(req.body);
  //var requestedID = mongoose.Types.ObjectId(req.body.requested_member_id);
  var requestedID = req.params.member_id;

  Friend.findOne({requestMemberID: requestID, requestedMemberID: requestedID})
  .then( (friend) => {
    if (friend) {
      friend.remove();
    }
    return res.json(util.successTrue('done'));
  })
  .catch( (err) => {
    console.log(err);
    return res.json(util.successFalse('error occured!'));
  });
});

// need test
router.get('/me/recommendation', async function(req, res) { // member_id가 추가한 친구 조회
  console.log('GET /api/friend/me/recommendation');
  var memberID = req.decoded._objID;
  var mutualFriends = {}; // 친구 추천 목록

  Friend.find({requestMemberID:memberID}) // 나의 친구를 받아옴
  .select('requestedMemberID')
  .then( async (friends) => {
    //console.log(friends)
    for (var i = 0; i < friends.length; ++i) {

      var friendsOfFriend = await (Friend.find({requestMemberID:friends[i].requestedMemberID})  // 친구의 친구를 받아옴
      .select('requestedMemberID')
      .populate('requestedMemberID')
      .then( (friendsOfFriend) => {
        return friendsOfFriend;
      })
      .catch( (err) => {
        return [];
      }));

      console.log(friendsOfFriend)
      for (var j = 0; j < friendsOfFriend.length; ++j)
      {
        var friendOfFriend = friendsOfFriend[j].requestedMemberID; // 친구의 친구중 한 명을 가져옴
        console.log(friendOfFriend.id)
        if (!mutualFriends.hasOwnProperty(friendOfFriend.id)) // 친구의 친구가 존재하지 않을때 초기화
        { 
          mutualFriends[friendOfFriend.id] = {};
          mutualFriends[friendOfFriend.id].num = 1;
          mutualFriends[friendOfFriend.id].info = friendOfFriend;
          //mutualFriends[friendOfFriend] = 1;
        }
        else
          mutualFriends[friendOfFriend.id].num += 1;
      }
    }

    console.log(mutualFriends)
    for (var i = 0; i < friends.length; ++i)
    {
      var friend = friends[i].requestedMemberID;
      //console.log(friend);
      if (mutualFriends.hasOwnProperty(friends[i].requestedMemberID)) // 친구의 친구가 이미 친구로 등록되있을 경우 친구 추천 목록에서 삭제
        delete mutualFriends[friend];
    }

    return res.json(util.successTrue(mutualFriends));
  })
  .catch( (err) => {
    //console.log(err);
    console.log(err);
    return res.json(util.successFalse('error occured!'));
  });
});

module.exports = router;

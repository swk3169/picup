/* 
 GET /message => 내 메시지 목록
 POST /message/:messageID => 초대 메시지 확인
 DELETE /message/:messageID => 메시지 삭제
*/

var express = require('express');
var router = express.Router();
var util = require('../utils');

var Message = require('../models/Message');
var Party = require('../models/Party');

var mongoose = require('mongoose');
var Transaction = require('mongoose-transactions'); 

var partyQuery = require('../query/partyQuery');
var boardQuery = require('../query/boardQuery');

router.use(util.isLoggedin);

router.get('/', function(req, res) { // message 정보 조회
  console.log('GET /api/message');
  var memberID = req.decoded._objID;

  Message.find({catcherID:memberID})
  .select(['senderID', 'messageKind', 'inviteBoardID'])
  .populate({ path: 'senderID', select: ['memberName', 'memberProfile', 'privateBoard']})
  .populate({ path: 'inviteBoardID', select: ['boardProfile', 'boardName']})
  .then( (messages) => {
    console.log(messages);
    return res.json(util.successTrue(messages));
  })
  .catch( (err) => {
    //console.log(err);
    return res.json(util.successFalse('error occured!'));
  });
});

router.post('/:messageID', async function(req, res) {
  var memberID = req.decoded._objID;
  var messageID = req.params.messageID;

  Message.findOne({_id: messageID, catcherID: memberID})
  .then( async (result) => {
    if (result) {
      if (result.messageKind == 1) { // 그룹 초대 메시지일 경우
        var boardID = result.inviteBoardID;

        var isJoined = await partyQuery.isJoined(boardID, memberID);
        if (!isJoined)
        { // 가입이 되어 있지 않을 경우
          var board = await boardQuery.getBoard(boardID);
          var writeAuth = board.canImmediateWrite;

          var partyInfo = {boardID: boardID, boardMemberID:memberID, writeAuth:writeAuth};
          console.log(partyInfo);

          const transaction = new Transaction();
          try {
            transaction.insert('party', partyInfo);

            const final = await transaction.run()
            return res.json(util.successTrue('done'));
        
          } catch(err) {
            console.log(err)
            await transaction.rollback().catch(console.error)
            transaction.clean();
        
            return res.json(util.successFalse('error occured!'));
          }
        }
        else { // 가입이 이미 되어 있을 경우
          return res.json(util.successFalse('already join group!'));
        }
      }
      // 그룹 초대 메시지가 아닌 경우
      return res.json(util.successFalse('it is not group invite message'));
    }
    else { // 메시지를 찾지 못했을 경우
      return res.json(util.successFalse('can not find message!'));
    }
    
  })
  .catch( (err) => { // 메시지 검색 도중 에러가 발생한 경우
    //console.log(err);
    return res.json(util.successFalse('error occured!'));
  });
});

router.delete('/:messageID', function(req, res) { // message 정보 삭제
  console.log('GET /api/message');
  var memberID = req.decoded._objID;
  var messageID = req.params.messageID;

  Message.findById(messageID)
  .remove()
  .then( (result) => {
    return res.json(util.successTrue('done'));
  })
  .catch( (err) => {
    //console.log(err);
    return res.json(util.successFalse('error occured!'));
  });
});

module.exports = router;

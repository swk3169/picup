var Party = require('../models/Party');
var ObjectId = require('mongodb').ObjectId; 

var partyQuery = {};

partyQuery.isJoined = async function(boardID, memberObjID) {
  var isJoined = await (Party.findOne({boardID:boardID, boardMemberID:memberObjID})
  .then((party) => {
    if (party) {
      return true;
    }
    else {
      return false;
    }
  })
  .catch ( (err) => {
    return false; 
  }));


  return isJoined;
}

partyQuery.getBoardMemberList = async function(boardID) {
  //console.log(boardID);
  var memberList =  await (Party.find({boardID:boardID})
  .then((memberList) => {
    if (memberList) {
      //console.log(memberList)
      return memberList;
    }
    else {
      return null;
    }
  })
  .catch ( (err) => {
    return null; 
  }));

  return memberList;
}

partyQuery.getBoardMemberListWithMemberInfo = async function(boardID) {
  //console.log(boardID);
  var memberList =  await (Party.find({boardID:boardID})
  .select('boardMemberID')
  .populate({ path: 'boardMemberID', select: ['memberProfile', 'memberName']})
  .then((memberList) => {
    if (memberList) {
      //console.log(memberList)
      return memberList;
    }
    else {
      return null;
    }
  })
  .catch ( (err) => {
    return null; 
  }));

  return memberList;
}

module.exports = partyQuery;
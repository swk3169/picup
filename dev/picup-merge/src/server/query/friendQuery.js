var Friend = require('../models/Friend');

var friendQuery = {};

friendQuery.getFriendList = async function(requestMemberID) {
  var friendList = await (Friend.findB({requestMemberID: requestMemberID})
  .then( (friendList) => {
    if (friendList) {
      return friendList;
    }
    else {
      return null;
    }
  })
  .catch ( (err) => {
    return null; 
  }));
  
  return friendList;
}

friendQuery.getMutualFriendList = async function(memberObjID) { // memberObjID의 서로친구 반환
  var myFriendList = await (Friend.find({requestMemberID: memberObjID})
  .select('requestedMemberID')
  .populate({ path: 'requestedMemberID', select: ['memberName', 'memberProfile', 'privateBoard']})
  .then( (friendList) => {
    if (friendList) {
      return friendList;
    }
    else {
      return null;
    }
  })
  .catch ( (err) => {
    return null; 
  }));

  if (!myFriendList) return null;

  var mutualFriendList = [];
  for (var i = 0; i < myFriendList.length; ++i) {
    var requestedMemberID = myFriendList[i].requestedMemberID._id;    // 친구 신청을 받은 사람 ID
    //console.log(requestedMemberID);

    var friend = await (Friend.findOne({requestMemberID: requestedMemberID, requestedMemberID: memberObjID})
    .then( (friend) => {
      if (friend) {
        return friend;
      }
      else {
        return null;
      }
    })
    .catch ( (err) => {
      return null; 
    }));

    //console.log(friend);
    if (friend) {
      mutualFriendList.push(myFriendList[i])
    }
  }

  return mutualFriendList;
}

friendQuery.getMutualFriendListWithoutBoardMember = async function(memberObjID, boardMemberList) { // 게시판의 멤버가 아닌 memberObjID의 서로친구 반환
  var myFriendList = await (Friend.find({requestMemberID: memberObjID, requestedMemberID:{"$nin": boardMemberList}})
  .select('requestedMemberID')
  .populate('requestedMemberID')
  .then( (friendList) => {
    if (friendList) {
      return friendList;
    }
    else {
      return null;
    }
  })
  .catch ( (err) => {
    return null; 
  }));

  var mutualFriendList = [];
  for (var i = 0; i < myFriendList.length; ++i) {
    var requestedMemberID = myFriendList[i].requestedMemberID._id;    // 친구 신청을 받은 사람 ID
    //console.log(requestedMemberID);

    var friend = await (Friend.findOne({requestMemberID: requestedMemberID, requestedMemberID: memberObjID})
    .then( (friend) => {
      if (friend) {
        return friend;
      }
      else {
        return null;
      }
    })
    .catch ( (err) => {
      return null; 
    }));

    //console.log(friend);
    if (friend) {
      mutualFriendList.push(myFriendList[i])
    }
  }

  return mutualFriendList;
}

friendQuery.isMutualFriend = async function(memberID1, memberID2) { // 서로친구 여부 확인
  var isFriend1 = await (Friend.findOne({requestMemberID: memberID1, requestedMemberID:memberID2})
  .then( (friend) => {
    if (friend) {
      return true;
    }
    else {
      return false;
    }
  })
  .catch ( (err) => {
    return false; 
  }));

  var isFriend2 = await (Friend.findOne({requestMemberID: memberID2, requestedMemberID:memberID1})
  .then( (friend) => {
    if (friend) {
      return true;
    }
    else {
      return false;
    }
  })
  .catch ( (err) => {
    return false; 
  }));

  return isFriend1 && isFriend2;
}

friendQuery.isFriend = async function(memberID1, memberID2) { // 서로친구 여부 확인
  var isFriend = await (Friend.findOne({requestMemberID: memberID1, requestedMemberID:memberID2})
  .then( (friend) => {
    if (friend) {
      return true;
    }
    else {
      return false;
    }
  })
  .catch ( (err) => {
    return false; 
  }));

  return isFriend;
}

module.exports = friendQuery;
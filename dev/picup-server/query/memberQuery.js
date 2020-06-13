var Member = require('../models/Member');

var memberQuery = {};

memberQuery.findMember = async function(memberObjID) {
  var member = await (Member.findById(memberObjID)
  .then( (member) => {
    if (member) {
      return member;
    }
    else {
      return null;
    }
  })
  .catch ( (err) => {
    return null; 
  }));

  return member;
}

memberQuery.findMemberByName = async function(memberName) {
  var memberList = await (Member.find({memberName: { "$regex": memberName, "$options": "i" }})
  .then( (memberList) => {
    if (memberList) {
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

memberQuery.isExisted = async function(memberObjID) {
  var isExisted = await (Member.findById(memberObjID)
  .then( (member) => {
    if (member) {
      //console.log(member)
      return true;
    }
    else {
      return false;
    }
  })
  .catch ( (err) => {
    return false; 
  }));

  return isExisted;
}


module.exports = memberQuery;
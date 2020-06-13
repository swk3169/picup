var Board = require('./models/Board');
var Party = require('./models/Party');

var permission = {};

var friendQuery = require('./query/friendQuery');
var postQuery = require('./query/postQuery');
var partyQuery = require('./query/partyQuery');

permission.checkWrite = async function(boardID, memberID) {
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

  if (!board) return 0; // board가 없을 경우 글 작성 권한 없음
  
  var party = await (Party.findOne({boardID:boardID, boardMemberID:memberID})  // member가 게시판에 가입되었는가를 확인
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
  //console.log(party);
  if (!party || !party.writeAuth) return 0;  // 가입되어 있지 않거나 글 작성 권한이 없을 경우 글 쓰기 권한 없음

  if (board.boardKind <= 1) // 게사판 종류가 group일 경우 1을 반환하여 visibility 속성을 0으로 제한한다.
    return 1;
  else  // 게시판 종류가 개인일 경우. Party를 통해 개인 게시판 주인임을 확인했으므로 2를 반환한다.
    return 2;
}

permission.checkRead = async function(boardID, memberID) {
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

  if (!board) return 0;

  if (board.boardKind === 0) { // 공개 그룹일 경우
    return [0];
  }
  else if (board.boardKind === 1) { // 비공개 그룹일 경우, 그룹에 가입되어 있어야함
    var party = await (Party.findOne({boardID:boardID, boardMemberID:memberID})
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
    //console.log(party);
    if (!party) return 0; // 그룹 멤버가 아닐 경우 권한 없음
    else return [0]; // 전체 공개된 글만 열람 가능
  }
  else { // 개인 게시판일 경우
    //console.log(board.managerID);
    //console.log(memberID);
    if (board.managerID.equals(memberID)) { // 자신의 게시판일 경우
      return [0, 1, 2];  // 모든 글 열람 가능
    }
    else { // 자신의 게시판이 아닐 경우
      var friendRequest = await (Party.findOne({requestMemberID:memberID, requestedMemberID:board.managerID}) // 로그인한 회원이 board manager를 친구로 두었을때를 확인
      .then((friend) => {
        if (friend) {
          return friend;
        }
        else {
          return null;
        }
      })
      .catch( (err) => {
        return null;
      }));

      var friendRequested = await (Party.findOne({requestMemberID:board.managerID, requestedMemberID:memberID}) // board의 manager가 로그인한 회원을 친구로 가질때를 확인
      .then((friend) => {
        if (friend) {
          return friend;
        }
        else {
          return null;
        }
      })
      .catch( (err) => {
        return null;
      }));

      if (friendRequest && friendRequested) // 서로 친구일 경우
        return [0, 1]; // 친구 공개 글까지 열람 가능
      else
        return [0]; // 전체 공개된 글만 열람 가능
    }
  } // 개인 게시판일 경우
}


permission.checkInvite = async function(boardID, memberObjID) {
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
  //console.log(board);
  if (!board || board.boardKind === 2) return false;

  var party = await (Party.findOne({boardID:boardID, boardMemberID:memberObjID})
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
  //console.log(party);
  //console.log(party);

  if (!party) return false; // 그룹 멤버가 아닐 경우 초대 권한 없음

  if (board.boardKind === 0) { // 공개 그룹일 경우
    return true;
  }
  else if (board.boardKind === 1) { // 비공개 그룹일 경우, 그룹장이여야 초대 가능
    //console.log(board.managerID);
    //console.log(memberObjID);
    return board.managerID.equals(memberObjID);  // mongoDB의 objectID일 경우 equals로 비교...
  }
}


permission.checkWriteComment = async function(boardID, postID, commentWriterID) {
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


  if (!board) return 0; // board가 없을 경우 글 작성 권한 없음

  if (board.boardKind === 2) { // 개인 게시판일 경우
    var post = await postQuery.getPost(postID);
    console.log(post.visibility);

    if (post.visibility === 0) // 전체 공개일 경우
      return 1;
    else if (post.visibility === 1) // 친구 공개일 경우 서로 친구일 경우 댓글 작성 권한 있음
      return friendQuery.isMutualFriend(post.postWriterID, commentWriterFriend);
    else  // 혼자 공개일 경우 자신의 글일 경우 댓글 작성 권한 있음
    {
      console.log(post.postWriterID);
      return post.postWriterID.equals(commentWriterID);
    }
  }
  else { // 그룹 게시판일 경우 그룹 가입자일 경우 댓글 작성 권한 있음
    return isJoined = await partyQuery.isJoined(boardID, commentWriterID);
  }
}


module.exports = permission;
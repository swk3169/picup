var Post = require('../models/Post');
var ObjectId = require('mongodb').ObjectId; 

var postQuery = {};

postQuery.getPost = async function(postID) {
  var post = await (Post.findById(postID)
  .then((post) => {
    if (post) {
      return post;
    }
    else {
      return null;
    }
  })
  .catch ( (err) => {
    return null; 
  }));

  console.log('in getPost!');
  console.log(post);
  return post;
}

postQuery.getCommentList = async function(postID) {
  var commentList = await (Post.findById(postID)
  .select('commentList').populate({  
    path:'commentList',
    model:'comment',
    populate: { // commentList의 commentWriterID를 확장시킴
      path: 'commentWriterID',
      model: 'member',
      select: ['memberName', 'memberProfile', 'privateBoard'],
    }
  })
  .then( (commentList) => {
    return commentList;
  })
  .catch( (err) => {
    console.log(err);
    return null;
  }));

  return commentList;
}

module.exports = postQuery;
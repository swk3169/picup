var mongoose = require('mongoose');

// mongodb는 기본적으로 _id라는 primary key가 생성된다.
// comment는 post에 많은 수가 달릴 수 있으므로 따로 Schema를 만들었음
var commentSchema = mongoose.Schema({
  /* mongodb schema design 원칙에 따라 1:Many인 경우 자식에서 부모의 Object ID를 가지지 않기 때문에 post_id는 삭제
  post_id: {
    type:mongoose.Schema.Types.ObjectId,
    required:[true,'Post ID is required!'],
  },*/
  // _id: mongoose.Schema.Types.ObjectId, // default로 존재
  commentWriterID: {
    type:String,
    ref:'member',
    required:[true,'Writer ID is required!'],
  },
  commentContents: {
    type:String,
    default:false,
  },
  commentTime: {
    type:Date,
    default:new Date(),
  },
}, {
  toObject:{virtuals:true} // virtual 필드를 추가할 수 있음
});

var Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongodb는 기본적으로 _id라는 primary key가 생성된다.
var friendSchema = mongoose.Schema({
  /* mongodb schema design 원칙에 따라 1:Many인 경우 자식에서 부모의 Object ID를 가지지 않기 때문에 post_id는 삭제
  post_id: {
    type:mongoose.Schema.Types.ObjectId,
    required:[true,'Post ID is required!'],
  },*/
  // _id: mongoose.Schema.Types.ObjectId, // default로 존재
  requestMemberID: {
    ref:'member',
    type:Schema.Types.ObjectId,
    required:[true,'Request Member ID is required!'],
  },
  requestedMemberID: {
    ref:'member',
    type:Schema.Types.ObjectId,
    required:[true,'Requested Member ID is required!'],
  },
}, {
  toObject:{virtuals:true} // virtual 필드를 추가할 수 있음
});

var Friend = mongoose.model('friend', friendSchema);

module.exports = Friend;


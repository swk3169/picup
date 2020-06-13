var mongoose = require('mongoose');

// mongodb는 기본적으로 _id라는 primary key가 생성된다.
var tagSchema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId, // default로 존재
  tagName: {
    type:String,
    match:[/^.{1,45}$/,'Tag Name Should be 1-45 characters!'],
    required:[true,'Tag Name is required!'],
  },
  //post_list: [[mongoose.Schema.Types.ObjectId]],
}, {
  toObject:{virtuals:true} // virtual 필드를 추가할 수 있음
});

var Tag = mongoose.model('tag', tagSchema);

module.exports = Tag;


// 게시물 좋아요 DB
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pickSchema = mongoose.Schema({
  memberID: {
    type: Schema.Types.ObjectId,
    ref:'member'
  },
  postID: {
    type: Schema.Types.ObjectId,
    ref:'postWithGeo'
  }
}, {
  toObject:{virtuals:true}
});

var Pick = mongoose.model('pick', pickSchema);

module.exports = Pick;

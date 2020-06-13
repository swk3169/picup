var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongodb는 기본적으로 _id라는 primary key가 생성된다.
var partySchema = mongoose.Schema({
  boardID:{
    type:Schema.Types.ObjectId,
    required:[true,'Board ID is required!'],
    ref:'board',
  },
  boardMemberID: {
    type:Schema.Types.ObjectId,
    ref:'member',
    required:[true,'Manager ID is required!'],
    trim:true,
  },
  writeAuth: {
    type:Boolean,
    default:false,
  },
}, {
  toObject:{virtuals:true} // virtual 필드를 추가할 수 있음
});

var Party = mongoose.model('party', partySchema);

module.exports = Party;


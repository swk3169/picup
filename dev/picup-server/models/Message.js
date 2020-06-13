var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = mongoose.Schema({
  catcherID : {
    type: Schema.Types.ObjectId,
    ref: 'member',
    require: [true,'Catcher ID is required!']
  },
  senderID : {
    ref: 'member',
    type: Schema.Types.ObjectId,
    require: [true,'Sender ID is required!']
  },
  messageKind : { // 0: 친구 메시지, 1: 그룹 메시지
    type: Number,
    require: [true, 'Message Kind is required!']
  },
  inviteBoardID : {
    ref: 'board',
    type: mongoose.Schema.Types.ObjectId
  }
});

var Message = mongoose.model('message', messageSchema);

module.exports = Message;